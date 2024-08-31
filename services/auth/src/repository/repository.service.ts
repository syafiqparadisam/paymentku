import { Inject, Injectable } from '@nestjs/common';
import { loginWithGoogle, registerRequest } from '../auth/dtos/request';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '../schema/schema';
import { Utils } from './utils';
@Injectable()
export class RepositoryService {
  constructor(
    @Inject('MYSQL_DB') private db: MySql2Database<typeof schema>,
    private readonly configService: ConfigService,
  ) {}

  generateAccountNumber(): number {
    return Math.floor(Math.random() * 9999999999) + 1;
  }

  async updatePhotoProfile(
    photoProfileUrl: string,
    profileId: number,
    publicId: string,
  ) {
    try {
      await this.ds.manager.transaction(
        'READ COMMITTED',
        async (entityManager: EntityManager) => {
          await entityManager.update<Profile>(
            Profile,
            { id: profileId },
            {
              photo_profile: photoProfileUrl,
            },
          );
          await entityManager.update<Profile>(
            Profile,
            { id: profileId },
            { photo_public_id: publicId },
          );
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async findAccNumber(accNumber: number): Promise<Users[]> {
    return this.userRepo.find({ where: { accountNumber: accNumber } });
  }
  async createAccountNumber(): Promise<number> {
    try {
      let accNumber: number;
      // check accountNumber is duplicate
      while (true) {
        const randNum: number =genera;
        const user: Users[] = await this.findAccNumber(randNum);
        if (user.length === 0) {
          accNumber = randNum;
          break;
        }
      }
      return accNumber;
    } catch (error) {
      throw error;
    }
  }

  async createAccount(data: registerRequest): Promise<void> {
    try {
      // hashing password by bcrypt
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(data.password, salt);

      const accNumber = await this.createAccountNumber();

      // create account with ACID transaction
      await this.ds.manager.transaction(
        'READ COMMITTED',
        async (entitymanager) => {
          // insert into profile
          const profile = new Profile();
          const userIcon = this.configService.get<string>('USER_ICON_DEFAULT');
          profile.name = data.user + generateRandNum().toString();
          profile.photo_profile = userIcon;
          await entitymanager.save(profile);
          // insert into users
          await entitymanager.insert(Users, {
            user: data.user,
            email: data.email,
            password,
            accountNumber: accNumber,
            created_at: new Date().toISOString(),
            balance: 0,
            profile,
          });
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async findUserById(id: number): Promise<Users> {
    try {
      return await this.userRepo.findOne({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async emptyPassword(userid: number) {
    try {
      await this.userRepo.update({ id: userid }, { password: null });
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<Users> {
    try {
      return await this.userRepo.findOne({ where: { email } });
    } catch (error) {
      throw error;
    }
  }

  async findUserByUsername(user: string): Promise<Users> {
    try {
      return await this.userRepo.findOne({ where: { user } });
    } catch (error) {
      throw error;
    }
  }

  async updateName(profileId: number, name: any) {
    try {
      await this.profileRepo.update(
        { id: profileId },
        { name: name.givenName + ' ' + name.familyName },
      );
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(password: string, user_id: number) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      await this.userRepo.update({ id: user_id }, { password: hashPassword });
    } catch (error) {
      throw error;
    }
  }

  async joiningUserAndProfile(userId: number): Promise<Users> {
    try {
      // join table users and profile
      const JoininguserAndProfile = await this.userRepo
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.profile', 'profile')
        .where('users.id = :id', { id: userId })
        .getOne();
      return JoininguserAndProfile;
    } catch (error) {
      throw error;
    }
  }

  async createAccountWithGoogle(user: loginWithGoogle) {
    try {
      const accNumber = await this.createAccountNumber();

      await this.ds.manager.transaction(
        'READ COMMITTED',
        async (entityManager: EntityManager) => {
          // insert into profile
          const profile = new Profile();
          profile.name = user.name.givenName + ' ' + user.name.familyName;
          profile.photo_profile = user.picture;
          await entityManager.save(profile);

          // insert into users
          await entityManager.insert(Users, {
            user: user.username,
            email: user.email,
            accountNumber: accNumber,
            created_at: new Date().toISOString(),
            profile: profile,
            balance: 0,
          });
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async updateUsername(userid: number, user: string) {
    try {
      await this.userRepo.update({ id: userid }, { user });
    } catch (error) {
      throw error;
    }
  }

  async deleteAccount(userid: number, profileId: number): Promise<void> {
    try {
      // delete account with ACID transaction
      await this.ds.manager.transaction(
        'READ COMMITTED',
        async (entityManager) => {
          await entityManager.delete(HistoryTopup, { user: { id: userid } });
          await entityManager.delete(HistoryTransfer, { user: { id: userid } });
          await entityManager.delete(Notification, { user: { id: userid } });
          await entityManager.delete(Profile, { id: profileId });
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async comparePassword(
    passwordFromPayload: string,
    passFromFindData: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(passwordFromPayload, passFromFindData);
    } catch (error) {
      throw error;
    }
  }
}
