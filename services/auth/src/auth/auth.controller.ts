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
  Inject,
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
import jwtPayload from '../interfaces/jwtPayload';
import { GoogleStrategy } from './strategies/google.strategy';

@Controller('/api/v1')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

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
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('google')
  async auth() {}

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
      const frontendUrl =
        this.configService.get<string>('FRONTEND') + '/dashboard';
      return res.redirect(frontendUrl);
    } catch (error) {
      console.log(error);
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
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
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('logout')
  async logout(@Request() req, @Response() res): Promise<response> {
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
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('confirm/passwordReset')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPasswordResetToken(
    @Body() emailDto: EmailDto,
    @Req() req: any,
    @Res() res,
  ): Promise<response> {
    try {
      const result = await this.authService.getPasswordResetToken(
        emailDto,
        req.cookies,
        res,
        req.cookies.pwToken,
      );
      return res.status(result.statusCode).json(result);
    } catch (error) {
      console.log(error);
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
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
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
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
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
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
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
