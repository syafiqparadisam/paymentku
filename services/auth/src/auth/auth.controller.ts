import {
  Body,
  Controller,
  Post,
  Delete,
  Req,
  Res,
  Request,
  Response,
  Get,
  UseGuards,
  Put,
  UsePipes,
  ValidationPipe,
  All,
  Query,
  Patch,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Header,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  EmailDto,
  NewPWDTO,
  VerifyDeleteAccount,
  loginRequest,
  registerRequest,
  updateUsernameDTO,
} from './dtos/request';
import { response } from '../interfaces/response';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { AccessTokenGuardGuard } from '../access-token-guard/access-token-guard.guard';
import { ConfigService } from '@nestjs/config';
import jwtPayload from "src/interfaces/jwtPayload"
import { GoogleStrategy } from './strategies/google.strategy';
import crypto from "crypto"
import { FileInterceptor } from '@nestjs/platform-express';
import { allowedFile } from '../config/cloudinary-options';
import { diskStorage } from 'multer';
import path from 'node:path';
import fs from "node:fs/promises"

@Controller('/api/v1')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) { }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body() loginDto: loginRequest,
    @Req() req,
    @Response() res,
  ): Promise<response> {
    try {
      const { data, message, statusCode, error } =
        await this.authService.signIn(loginDto, req.cookies, res);

      if (statusCode == 200) {
        res.cookie('authToken', data.authToken, {
          expires: new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000),
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        });
        return res.status(statusCode).json({
          statusCode: 200,
          message,
        });
      } else {
        return res
          .status(statusCode)
          .json({ statusCode: statusCode, data, message, error });
      }
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  @Get('google')
  async auth() { }

  @Get('auth/login/google')
  @UseGuards(GoogleOauthGuard)
  @UseGuards(GoogleStrategy)
  @UsePipes(new ValidationPipe())
  async googleAuthCallback(@Req() req, @Response() res) {
    try {
      const result = await this.authService.signInWithGoogle(
        req.user,
        req.cookies,
        res,
      );
      if (result.statusCode != 200) {
        return res.status(result.statusCode).json(result);
      }
      res.cookie('authToken', result.data.authToken, {
        expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });
      const frontendUrl = this.configService.get<string>('FRONTEND') + '/dashboard/user';
      return res.redirect(frontendUrl);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(
    @Body() registerDto: registerRequest,
    @Response() res,
    @Req() req,
  ): Promise<response> {
    try {
      const { data, message, statusCode, error } =
        await this.authService.createAccount(registerDto, req.cookies, res);
      return res.status(statusCode).json({
        statusCode,
        data,
        message,
        error,
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  @Delete('logout')
  async logout(@Request() req, @Response() res): Promise<response> {
    console.log(req.cookies);
    try {
      const result = await this.authService.logout(req.cookies, res);
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      });
      return res.status(result.statusCode).json(result);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  @Post('confirm/passwordReset')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPasswordResetToken(
    @Body() emailDto: EmailDto,
    @Req() req: any,
    @Res() res,
  ): Promise<response> {
    console.log(req.cookies)
    try {
      const result = await this.authService.getPasswordResetToken(
        emailDto,
        req.cookies,
        res,
        req.cookies.pwToken
      );
      return res.status(result.statusCode).json(result);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  @Put('passwordChange')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateNewPasswordUser(
    @Query('token') token: string,
    @Body() newPWDto: NewPWDTO,
    @Res() res,
  ): Promise<response> {
    try {
      const result = await this.authService.updatePassword(newPWDto, token);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  @Delete('user')
  @UseGuards(AccessTokenGuardGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async deleteAccount(
    @Request() req,
    @Body() verifyDeleteAccount: VerifyDeleteAccount,
    @Res() res,
  ): Promise<void> {
    try {
      const userData: jwtPayload = {
        user_id: req.user_id,
      };
      const result = await this.authService.deleteAccount(
        userData,
        req.cookies,
        verifyDeleteAccount,
        res,
      );
      return res.status(result.statusCode).json(result);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  @Patch('username')
  @UseGuards(AccessTokenGuardGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async verifyAndUpdateUsername(
    @Body() body: updateUsernameDTO,
    @Request() req,
    @Res() res,
  ): Promise<void> {
    try {
      const userData: jwtPayload = {
        user_id: req.user_id,
      };
      const result = await this.authService.verifyAndUpdateUsername(
        body,
        userData,
      );
      return res.status(result.statusCode).json(result);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  @All('transaction*')
  @UseGuards(AccessTokenGuardGuard)
  async redirectToTransactionService(
    @Req() req,
    @Res() res,
    @Body() body,
  ): Promise<void> {
    // config url to fetch into another service
    const tf_svc = this.configService.get<string>('TF_SVC');
    const spliturl: string[] = req.url.split('/');
    const urlAfterProfile = spliturl.slice(4, spliturl.length).join('/');
    let url;
    if (spliturl.length == 4 || spliturl[4] == '') {
      url = tf_svc + urlAfterProfile + '?userid=' + req.user_id;
    } else {
      url = tf_svc + '/' + urlAfterProfile + '?userid=' + req.user_id;
    }

    try {
      console.log(url);
      const data = await this.fetcherService(url, req, body);
      return res.status(data.statusCode).json(data);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  @All('history*')
  @UseGuards(AccessTokenGuardGuard)
  async redirectToHistoryService(
    @Req() req,
    @Res() res,
    @Body() body,
  ): Promise<void> {
    // config url to fetch into another service
    const history_svc = this.configService.get<string>('HISTORY_SVC');
    const spliturl: string[] = req.url.split('/');
    console.log(spliturl);
    const urlAfterProfile = spliturl.slice(4, spliturl.length).join('/');
    let url;
    if (spliturl.length == 4 || spliturl[4] == '') {
      url = history_svc + urlAfterProfile + '?userid=' + req.user_id;
    } else {
      url = history_svc + '/' + urlAfterProfile + '?userid=' + req.user_id;
    }

    try {
      const data = await this.fetcherService(url, req, body);
      return res.status(data.statusCode).json(data);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  @Patch("profile/photoprofile")
  @UseGuards(AccessTokenGuardGuard)
  @UseInterceptors(FileInterceptor("image", {
    storage: diskStorage({
      destination: path.join(__dirname, "..", "..", "src", "uploads"),
      filename(req, file, cb) {
        const uniqueFile = new Date() + file.originalname
        cb(null, uniqueFile);
      },
    }),
  }))
  async updatePhotoProfile(@UploadedFile() file: Express.Multer.File, @Request() req, @Response() res) {
    try {


      const isAllow = allowedFile.includes(file.mimetype)
      if (!isAllow) {
        await fs.rm(file.path)
        return res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).json({ statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE, message: `File type ${file.mimetype} not allowed` })
      }
      // max image is 2 mb
      const maxFileSize = 2 * 1024 * 1024
      if (file.size > maxFileSize) {
        await fs.rm(file.path)
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ statusCode: HttpStatus.UNPROCESSABLE_ENTITY, message: "Image should be less than 2 mb size" })
      }
      const userData: jwtPayload = {
        user_id: req.user_id
      }
      console.log(req.headers)
      const result = await this.authService.updatePhotoProfile(userData, file.path, req.headers["x-data-publicid"])
      return res.json(result)
    } catch (error) {
      console.log(error)
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async fetcherService(url: string, req: Request, body) {
    try {
      let result;
      if (req.method == 'GET' || !body) {
        result = await fetch(url, {
          method: req.method,
          headers: {
            ...req.headers,
            "X-Request-Id": crypto.randomUUID()
          },
        });
      } else {
        result = await fetch(url, {
          method: req.method,
          headers: {
            ...req.headers,
            "X-Request-Id": crypto.randomUUID()
          },
          body: JSON.stringify(body),
        });
      }
      console.log(result)
      const data = await result.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  @All('profile*')
  @UseGuards(AccessTokenGuardGuard)
  async redirectToProfileService(
    @Req() req: Request | any,
    @Res() rs,
    @Body() body,
  ) {
    // config url to fetch into another service
    const usr_svc = this.configService.get<string>('USER_SVC');
    const spliturl: string[] = req.url.split('/');
    const urlAfterProfile = spliturl.slice(4, spliturl.length).join('/');
    let url;
    if (spliturl.length == 4 || spliturl[4] == '') {
      url = usr_svc + urlAfterProfile + '?userid=' + req.user_id;
    } else {
      url = usr_svc + '/' + urlAfterProfile + '?userid=' + req.user_id;
    }
    try {
      const data = await this.fetcherService(url, req, body);
      return rs.status(data.statusCode).json(data);
    } catch (error) {
      return rs.sendStatus(500);
    }
  }
}
