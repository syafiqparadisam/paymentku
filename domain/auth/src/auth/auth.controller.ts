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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailDto, loginRequest, registerRequest } from './dtos/request.js';
import { response } from '../interfaces/response';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { AccessTokenGuardGuard } from 'src/access-token-guard/access-token-guard.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body() loginDto: loginRequest,
    @Request() req,
    @Response() res,
  ): Promise<response> {
    const { data, message, statusCode, error } =
      await this.authService.signIn(loginDto, req.cookies);
    if (statusCode === 200) {
      res.cookie('refreshToken', data.refreshToken, {
        expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      return res.status(statusCode).json({
        statusCode: 200,
        data: { accessToken: data.accessToken },
        message,
        error
      });
    } else {
      return res.status(statusCode).json({ statusCode: statusCode, data, message, error });
    }
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() { }

  @Get('auth/login/google')
  @UseGuards(GoogleOauthGuard)
  @UsePipes(new ValidationPipe())
  async googleAuthCallback(@Req() req, @Response() res) {
    const result = await this.authService.signInWithGoogle(req.user, req.cookies)
    if (result.statusCode != 200) {
      return res.status(result.statusCode).json(result)
    }
    res.cookie('refreshToken', result.data.refreshToken, {
      expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return res.status(result.statusCode).json({
      statusCode: result.statusCode,
      data: { accessToken: result.data.accessToken },
      message: result.message
    })
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() registerDto: registerRequest, @Response() res): Promise<response> {
    const { data, message, statusCode, error } = await this.authService.createAccount(registerDto);
    if (statusCode == 200) {
      return res.status(statusCode).json({
        statusCode,
        data,
        message,
        error
      })
    }
    return res.status(statusCode).json({
      statusCode,
      data,
      message,
      error
    })
  }

  @Delete('logout')
  async logout(@Request() req, @Response() res): Promise<response> {
    console.log(req.cookies);
    await this.authService.logout(req.cookies);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return res.sendStatus(204)
  }

  @Get('refresh')
  async getNewAccessToken(@Request() req, @Response() res): Promise<response> {
    const result = await this.authService.getNewAccessToken(req.cookies)
    if (result.statusCode === 204) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      return res.sendStatus(204);
    } else {

      return res.status(result.statusCode).json(result);
    }
  }

  @Get("password-reset/token")
  async getPasswordResetToken(@Body() emailDto: EmailDto): Promise<response> {
    
  }

  @Post("password-reset/:token")

  @Get("history")
  @UseGuards(AccessTokenGuardGuard)
  redirectToHistoryService(@Request() req, @Res() res): void {
    const userData = JSON.stringify({
      user_id: req.user_id,
      email: req.email
    })
    res.header("X-User-Data", userData)
    res.redirect(302, "http://localhost:8801")
  }


  @Get("transaction")
  @UseGuards(AccessTokenGuardGuard)
  redirectToTransactionService(@Request() req, @Res() res): void {
    const userData = JSON.stringify({
      user_id: req.user_id,
      email: req.email
    })
    res.header("X-User-Data", userData)
    res.redirect(302, "http://localhost:8802")
  }


  @Get("profile")
  @UseGuards(AccessTokenGuardGuard)
  redirectToProfileService(@Request() req, @Res() res): void {
    const userData = JSON.stringify({
      user_id: req.user_id,
      email: req.email
    })
    console.log(userData)
    res.header("X-User-Data", userData)
    res.redirect(302, "http://localhost:3000")
  }
}
