import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { loginRequest, registerRequest } from 'src/interfaces/request';
import { response } from 'src/interfaces/response';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(payload: loginRequest): Promise<response> {
    try {
      // findUser and compare it
      const user = await this.usersService.findUser(payload.user);
      console.log(user);
      if (user == null) {
        return {
          statusCode: 400,
          message: 'Wrong Username or Password',
        };
      }
      const comparePass = await this.usersService.comparePassword(
        payload.password,
        user.password,
      );
      console.log(comparePass);
      if (comparePass == false) {
        return {
          statusCode: 400,
          message: 'Wrong Username or Password',
        };
      } else {
        const payload = {
          user: user.user,
          email: user.email,
        };
        const secret = this.configService.get<string>('JWT_SECRET');
        console.log(payload);
        const accessToken = await this.jwtService.signAsync(payload, {
          secret: secret,
          expiresIn: 3600 * 24 * 7,
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
          secret,
          expiresIn: 3600 * 24 * 30,
        });
        await this.usersService.addRefreshToken(refreshToken, payload.user);
        return {
          statusCode: 200,
          data: { accessToken, refreshToken },
          message: 'Ok',
        };
      }
    } catch (err) {
      return {
        statusCode: 400,
        data: null,
        message: err,
      };
    }
  }

  async createAccount(data: registerRequest): Promise<response> {
    try {
      const findDuplicateUser = await this.usersService.findUser(data.user);
      if (findDuplicateUser) {
        return {
          statusCode: 409,
          message: `User ${data.user} has been exist`,
        };
      } else {
        await this.usersService.createAccount(data);

        return {
          statusCode: 201,
          message: `User ${data.user} has been succesfully created`,
        };
      }
    } catch (err) {
      return {
        statusCode: 400,
        data: null,
        message: err,
      };
    }
  }

  async getNewRefreshToken(cookie): Promise<response> {
    if (!cookie.refreshToken) {
      return {
        statusCode: 401,
        message: 'Unauthorized',
      };
    }

    try {
      console.log(cookie);
      // findUserByRefToken
      const secret = this.configService.get<string>('JWT_SECRET');
      console.log(secret);
      const user = await this.usersService.findRefreshToken(
        cookie.refreshToken,
      );
      if (user == null) {
        return { statusCode: 400, message: 'Bad Request' };
      } else {
        const checkUserIsVerify = await this.jwtService.verifyAsync(
          cookie.refreshToken,
          { secret: secret },
        );
        console.log(checkUserIsVerify);
        if (!checkUserIsVerify) {
          await this.usersService.deleteRefreshToken(user.user);
          return { statusCode: 204, message: 'No Content' };
        } else if (
          checkUserIsVerify.user === user.user &&
          checkUserIsVerify.email === user.email
        ) {
          // give new accessToken
          console.log('ishere');
          const accessToken = await this.jwtService.signAsync(
            {
              user: user.user,
              email: user.email,
            },
            {
              secret,
              expiresIn: 3600 * 24 * 7,
            },
          );
          console.log(accessToken);
          return {
            statusCode: 200,
            data: {
              accessToken,
            },
            message: 'Ok',
          };
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error,
      };
    }
  }

  async logout(cookie): Promise<response> {
    if (!cookie.refreshToken) {
      return {
        statusCode: 204,
      };
    }

    try {
      // findUserByRefreshToken
      const user = await this.usersService.findRefreshToken(
        cookie.refreshToken,
      );
      console.log(user);
      if (user.refreshToken === null) {
        return {
          statusCode: 204,
        };
      }
      await this.usersService.deleteRefreshToken(user.user);
      return {
        statusCode: 204,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: error,
      };
    }
  }
}
