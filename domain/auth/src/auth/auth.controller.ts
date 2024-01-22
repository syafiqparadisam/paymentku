import {
  Body,
  Controller,
  Post,
  Delete,
  Request,
  Response,
  Get,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginRequest, registerRequest } from 'src/interfaces/request';
import { response } from 'src/interfaces/response';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() signInDto: loginRequest,
    @Response() res,
  ): Promise<response> {
    const { data, message, statusCode } =
      await this.authService.signIn(signInDto);
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
      });
    } else {
      return res.status(statusCode).json({ statusCode: 200, data, message });
    }
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() signUpDto: registerRequest): Promise<response> {
    return await this.authService.createAccount(signUpDto);
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
    const result = await this.authService.getNewRefreshToken(req.cookies);
    if (result.statusCode === 204) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      return res.sendStatus(204);
    } else {
      return res.json(result);
    }
  }
}
