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
  HttpCode,
  Redirect,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginRequest, registerRequest } from './dtos/request.js';
import { response } from '../interfaces/response';
import { GoogleOauthGuard } from './guards/google-oauth.guard';

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
    const { data, message, statusCode,error } =
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
    } else if (statusCode == 204) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })

      return res.status(statusCode).json(data)
    } else {
      return res.status(statusCode).json({ statusCode: statusCode, data, message });
    }
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() { }

  @Get('/auth/login/google')
  @UseGuards(GoogleOauthGuard)
  @UsePipes(new ValidationPipe())
  async googleAuthCallback(@Req() req, @Response() res) {
    const result = await this.authService.signInWithGoogle(req.user)
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
  @HttpCode(201)
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

  @Delete('/logout')
  async logout(@Request() req, @Response() res): Promise<response> {
    console.log(req.cookies);
    const result = await this.authService.logout(req.cookies);
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

  @UseGuards()
  async verifyUser(@Request() req): Promise<void> {

  }
}
