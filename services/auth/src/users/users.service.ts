import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../schemas/users.entity';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { loginWithGoogle, registerRequest } from '../auth/dtos/request';
import * as bcrypt from 'bcrypt';
import { Profile } from '../schemas/profile.entity';
import { HistoryTopup } from '../schemas/history_topup.entity';
import { Notification } from '../schemas/notification.entity';
import { HistoryTransfer } from '../schemas/history_transfer.entity';
import { ConfigService } from '@nestjs/config';
import { profile, profileForFindWithAccount } from '../interfaces/profile';
import { join } from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepo: Repository<Users>,
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
    private readonly ds: DataSource,
    private readonly configService: ConfigService,
  ) {}

  generateAccountNumber(): number {
    return Math.floor(Math.random() * 9999999999) + 1;
  }

  async;

  async getProfileByAccountNumber(
    accNumber: number,
  ): Promise<profileForFindWithAccount | null> {
    try {
      const joined = await this.userRepo
        .createQueryBuilder('users')
        .leftJoin('users.profile', 'profile')
        .select([
          'users.id',
          'users.user',
          'users.accountNumber',
          'users.created_at',
          'profile.name',
          'profile.photo_profile',
        ])
        .where('users.accountNumber = :accountNumber', {
          accountNumber: accNumber,
        })
        .getRawOne();

      if (!joined) {
        return null;
      }

      return {
        id: joined.users_id,
        user: joined.users_user,
        accountNumber: joined.users_accountNumber,
        created_at: joined.users_created_at,
        name: joined.profile_name,
        photo_profile: joined.profile_photo_profile,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(userid: number): Promise<profile> {
    try {
      const joined = await this.userRepo
        .createQueryBuilder('users')
        .leftJoin('users.profile', 'profile')
        .select([
          'users.id',
          'users.user',
          'users.email',
          'users.accountNumber',
          'users.balance',
          'users.created_at',
          'profile.name',
          'profile.bio',
          'profile.phone_number',
          'profile.photo_profile',
          'profile.photo_public_id',
        ])
        .where('users.id = :id', { id: userid })
        .getRawOne();

      return {
        id: joined.users_id,
        user: joined.users_user,
        email: joined.users_email,
        accountNumber: joined.users_accountNumber,
        balance: BigInt(joined.users_balance),
        created_at: joined.users_created_at,
        name: joined.profile_name,
        bio: joined.profile_bio,
        phone_number: joined.profile_phone_number,
        photo_profile: joined.profile_photo_profile,
        photo_public_id: joined.profile_photo_public_id,
      };
    } catch (error) {
      throw error;
    }
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

  generateRandNum(): number {
    const buffer = crypto.randomBytes(4);
    const uniqueRandom = buffer.readUInt32LE(0);
    return uniqueRandom;
  }

  async createAccountNumber(): Promise<number> {
    try {
      let accNumber: number;
      // check accountNumber is duplicate
      while (true) {
        const randNum: number = this.generateRandNum();
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
          profile.name = data.user + this.generateRandNum().toString();
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
    return this.userRepo.findOne({ where: { email } });
  }

  async findUserByUsername(user: string): Promise<Users> {
    return this.userRepo.findOne({ where: { user } });
  }

  async updateName(
    profileId: number,
    firstName: string,
    lastName: string = '',
  ) {
    return this.profileRepo.update(
      { id: profileId },
      { name: firstName + lastName },
    );
  }

  async updatePhoneNumber(profileId: number, phone_number: string) {
    return this.profileRepo.update({ id: profileId }, { phone_number });
  }

  async updateBio(profileId: number, bio: string) {
    return this.profileRepo.update({ id: profileId }, { bio });
  }

  async updatePassword(password: string, user_id: number) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      return this.userRepo.update({ id: user_id }, { password: hashPassword });
    } catch (error) {
      throw error;
    }
  }

  async joiningUserAndProfile(userId: number): Promise<Users> {
    return this.userRepo
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.profile', 'profile')
      .where('users.id = :id', { id: userId })
      .getOne();
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
    return this.userRepo.update({ id: userid }, { user });
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
    return bcrypt.compare(passwordFromPayload, passFromFindData);
  }
}
