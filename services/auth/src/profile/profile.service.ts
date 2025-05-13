import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { response } from '../interfaces/response';
import { RedisService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';
import { profile } from 'src/interfaces/profile';
import jwtPayload from 'src/interfaces/jwtPayload';
import fs from 'node:fs/promises';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
@Injectable()
export class ProfileService {
  constructor(
    private usersService: UsersService,
    private redisService: RedisService,
	private cloudinaryService: CloudinaryService,
  ) {}

  async getUserProfile(userid: number): Promise<response> {
    try {
      let profile: profile | null;
      const lockKey = crypto.randomUUID();
      // check cache
      profile = await this.redisService.getCacheProfile(userid, [lockKey]);
	  console.log(profile)
      if (!profile) {
        profile = await this.usersService.getUserProfile(userid);

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
    } catch (error) {}
  }


  async updatePhotoProfile(
    userData: jwtPayload,
    pathUploadfile: string,
    publicIdImg: string,
  ): Promise<response> {
    try {
      const lockKey = crypto.randomUUID();
      // upload file to cloudinary
      const result = await this.cloudinaryService.uploadImage(pathUploadfile);

      // update url and publicid to database
      const joinUserAndProfile = await this.usersService.joiningUserAndProfile(
        userData.user_id,
      );
      // delete cache profile
      await this.redisService.deleteCacheProfile([lockKey], userData.user_id);

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
