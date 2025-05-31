import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { response } from '../interfaces/response';
import { RedisService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';
import { profile } from 'src/interfaces/profile';
import jwtPayload from 'src/interfaces/jwtPayload';
import fs from 'node:fs/promises';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { lock } from 'superagent';
@Injectable()
export class ProfileService {
  constructor(
    private usersService: UsersService,
    private redisService: RedisService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getUserProfile(userid: number): Promise<response> {
    try {
      let profile: profile | any;
      const lockKey = crypto.randomUUID();
      // check cache
      profile = await this.redisService.getCacheProfile(userid, [lockKey]);
      if (!profile) {
        profile = await this.usersService.getUserProfile(userid);
        profile.balance = profile.balance.toString();

        // set cache
        await this.redisService.cacheUserProfile(userid, [lockKey], profile);
        return {
          statusCode: HttpStatus.OK,
          data: profile,
        };
      }

      return {
        statusCode: HttpStatus.OK,
        data: profile,
      };
    } catch (error) {
      throw error;
    }
  }

  async updatePhoneNumber(
    phone_number: string,
    user_id: number,
  ): Promise<response> {
    try {
      const user = await this.usersService.joiningUserAndProfile(user_id);
      await this.usersService.updatePhoneNumber(user.profile.id, phone_number);
      const lockKey = crypto.randomUUID();
      await this.redisService.delCacheProfile(user_id, [lockKey]);
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully update phone number',
      };
    } catch (error) {
      throw error;
    }
  }

  async updateBio(bio: string, user_id: number): Promise<response> {
    try {
      const user = await this.usersService.joiningUserAndProfile(user_id);
      await this.usersService.updateBio(user.profile.id, bio);
      const lockKey = crypto.randomUUID();
      await this.redisService.delCacheProfile(user_id, [lockKey]);

      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully update bio',
      };
    } catch (error) {
      throw error;
    }
  }

  async updateName(name: string, user_id: number): Promise<response> {
    try {
      const user = await this.usersService.joiningUserAndProfile(user_id);
      await this.usersService.updateName(user.profile.id, name);
      const lockKey = crypto.randomUUID();
      await this.redisService.delCacheProfile(user_id, [lockKey]);

      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully update name to ' + name,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserProfileByAccNumber(accNumber: number): Promise<response> {
    try {
      const user = await this.usersService.getProfileByAccountNumber(accNumber);
      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: `User with account number ${accNumber} not found`,
        };
      }

      return {
        statusCode: HttpStatus.OK,
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  async updatePhotoProfile(
    userData: jwtPayload,
    pathUploadfile: string,
    publicIdImg: string,
  ): Promise<response> {
    try {
      // upload file to cloudinary
      const result = await this.cloudinaryService.uploadImage(pathUploadfile);

      // update url and publicid to database
      const joinUserAndProfile = await this.usersService.joiningUserAndProfile(
        userData.user_id,
      );
      // delete cache profile
      const lockKey = crypto.randomUUID()
      await this.redisService.delCacheProfile(userData.user_id, [lockKey])

      await this.usersService.updatePhotoProfile(
        result.secure_url,
        joinUserAndProfile.profile.id,
        result.public_id,
      );

      // delete from cloudinary if this image already updated, in order to not over storage in cloudinary
      publicIdImg == ''
        ? null
        : await this.cloudinaryService.deleteImage(publicIdImg);

      await fs.rm(pathUploadfile);
      return {
        statusCode: HttpStatus.OK,
        message: 'Photo profile has been changed',
      };
    } catch (error) {
      throw error;
    }
  }
}
