import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  LoggerService,
  Patch,
  Request,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { response } from 'src/interfaces/response';
import { AccessTokenGuardGuard } from 'src/access-token-guard/access-token-guard.guard';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'node:path';
import fs from 'node:fs/promises';
import { allowedFile } from 'src/config/cloudinary-config';
import jwtPayload from 'src/interfaces/jwtPayload';

@Controller('/api/v1/profile')
export class ProfileController {
  constructor(
    private configService: ConfigService,
    private profileService: ProfileService,
  ) {}

  // Get user profile
  @Get('/')
  @UseGuards(AccessTokenGuardGuard)
  async getUserProfile(@Request() req, @Response() res) {
    try {
      const resp = await this.profileService.getUserProfile(req.user_id);

      return res.status(resp.statusCode).json(resp);
    } catch (error) {
      console.log(error);
      return res.sendStatus(HttpStatus.OK);
    }
  }

  @Patch('photoprofile')
  @UseGuards(AccessTokenGuardGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: path.join(__dirname, '..', '..', 'src', 'uploads'),
        filename(_, file, cb) {
          const uniqueFile = new Date() + file.originalname;
          cb(null, uniqueFile);
        },
      }),
    }),
  )
  async updatePhotoProfile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Response() res,
  ) {
    try {
      const isAllow = allowedFile.includes(file.mimetype);
      if (!isAllow) {
        await fs.rm(file.path);
        return res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).json({
          statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          message: `File type ${file.mimetype} not allowed`,
        });
      }
      // max image is 2 mb
      const maxFileSize = 2 * 1024 * 1024;
      if (file.size > maxFileSize) {
        await fs.rm(file.path);
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Image should be less than 2 mb size',
        });
      }

      const userData: jwtPayload = {
        user_id: req.user_id,
      };

      const result = await this.profileService.updatePhotoProfile(
        userData,
        file.path,
        req.headers['x-data-publicid'],
      );
      return res.json(result);
    } catch (error) {
      console.log(error);
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
