import { Inject, Injectable } from '@nestjs/common';
import { loginWithGoogle, registerRequest } from '../auth/dtos/request';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '../schema/schema';
import { Utils } from './utils';
import { eq } from 'drizzle-orm';
import { accountNumber } from 'src/domain/sqlResultType';
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
      await this.db.transaction(
        async (tx) => {
          await tx
            .update(schema.Profile)
            .set({ photo_profile: photoProfileUrl })
            .where(eq(schema.Profile.id, profileId));

          await tx
            .update(schema.Profile)
            .set({ photo_public_id, publicId })
            .where(eq(schema.Profile.id, profileId));
        },
        {
          isolationLevel: 'read committed',
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async findAccNumber(accNumber: number): Promise<accountNumber[]> {
    try {
      const users = await this.db
        .select({
          accountNumber: schema.Users.accountNumber,
        })
        .from(schema.Users)
        .where(eq(schema.Users.accountNumber, accNumber));
      return users;
    } catch (error) {
      throw error;
    }
  }

  async createAccountNumber(): Promise<number> {
    try {
      let accNumber: number;
      // check accountNumber is duplicate
      while (true) {
        const randNum: number = this.generateAccountNumber();
        const user = await this.findAccNumber(randNum);
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

  generateRandNum(): number {
    return Math.floor(Math.random() * 99999) + 1;
  }

  async createAccount(data: registerRequest): Promise<void> {
    try {
      // hashing password by bcrypt
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(data.password, salt);
      const accNumber = await this.createAccountNumber();

      // create account with ACID transaction
      await this.db.transaction(
        async (tx) => {
          const result = await tx
            .insert(schema.Profile)
            .values({ name: data.user + this.generateRandNum().toString() })
            .$returningId();

          await tx.insert(schema.Users).values({
            user: data.user,
            email: data.email,
            password,
            accountNumber: accNumber,
            profile_id: result.id,
          });
        },
        {
          isolationLevel: 'read committed',
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async findUserById(id: number): Promise<typeof schema.Users> {
    try {
      return await this.db
        .select()
        .from(schema.Users)
        .where(eq(schema.Users.id, id));
    } catch (error) {
      throw error;
    }
  }

  async emptyPassword(userid: number) {
    try {
      await this.db
        .update(schema.Users)
        .set({ password: null })
        .where(eq(schema.Users.id, userid));
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<typeof schema.Users> {
    try {
      return await this.db.select().from(schema.Users).where({ email });
    } catch (error) {
      throw error;
    }
  }

  async findUserByUsername(user: string): Promise<typeof schema.Users> {
    try {
      return await this.db.select().from(schema.Users).where({user})
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
