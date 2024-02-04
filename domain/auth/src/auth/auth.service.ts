import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { loginRequest, loginWithGoogle, registerRequest } from './dtos/request';
import { response } from '../interfaces/response';
import { UsersService } from '../users/users.service';
import { jwtPayload } from 'src/interfaces/jwtPayload';
import { RefreshTokenService } from 'src/refreshToken/refreshToken.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rTokenService: RefreshTokenService,
    private readonly configService: ConfigService,
  ) { }


  async generateJWT(payload: jwtPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, { secret: this.configService.get<string>("JWT_SECRET") })
  }

  async signInWithGoogle(payload: loginWithGoogle): Promise<response> {
    if (!payload) {
      return {
        statusCode: 400,
        message: "Field is null"
      }
    }
    // find user
    const findDuplicateUserByEmail = await this.usersService.findUserByEmail(payload.email);
    const findDuplicateUserByUsername = await this.usersService.findUserByUsername(payload.username)

    if (findDuplicateUserByEmail) {
      return {
        statusCode: 409,
        message: `Email ${findDuplicateUserByEmail.email} has been exist`
      }
    }
    if (findDuplicateUserByUsername) {
      return {
        statusCode: 409,
        message: `User ${findDuplicateUserByUsername.user} has been exist`,
      };
    }
    // if user is null then create Account
    if (!findDuplicateUserByEmail && !findDuplicateUserByUsername) {

      const result = await this.usersService.createAccountWithGoogle(payload)
      if (!result.success) {
        return {
          statusCode: 500,
          message: "Server error"
        }
      } else {


        const findUser = await this.usersService.findUserByEmail(payload.email)
        const accessToken = await this.generateJWT({ user_id: findUser.id, email: findUser.email })

        const refreshToken = await this.generateJWT({ user_id: findUser.id, email: findUser.email })
        return {
          statusCode: 200,
          data: { accessToken, refreshToken },
          message: "Ok"
        }
      }
    }
    const accessToken = await this.generateJWT({ user_id: findDuplicateUserByUsername.id, email: findDuplicateUserByUsername.email })
    const refreshToken = await this.generateJWT({ user_id: findDuplicateUserByUsername.id, email: findDuplicateUserByUsername.email })
    // get this name
    return {
      statusCode: 200,
      data: { accessToken, refreshToken },
      message: "OK"
    }

  }

  async signIn(payload: loginRequest, cookies: any): Promise<response> {
    try {
      // findUser and compare it
      console.log(payload)
      const user = await this.usersService.findUserByUsername(payload.user)
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
      }
      if (user) {
        const payload = {
          user_id: user.id,
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

        const findTokenFromCookieAndDelete = await this.rTokenService.findTokenAndDelete(user.refreshToken_id, cookies.refreshToken)
        const findToken = await this.rTokenService.findTokenById(user.refreshToken_id)
        let { success, data } = cookies.refToken ? findTokenFromCookieAndDelete : findToken
        if (data && success) {
          const findCookie = await this.rTokenService.findTokenFromToken(cookies.refreshToken)
          if (!findCookie) {
            console.log("Where Token Is Come From ?")
            data = []
          }

          return {
            statusCode: 204,
            message: "Delete Cookie"
          }
        }
        const newRtokenArray: string[] = [...data, refreshToken]
        await this.rTokenService.add(user.refreshToken_id, newRtokenArray)

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
        error: err
      };
    }
  }

  async createAccount(data: registerRequest): Promise<response> {


    try {
      const findDuplicateUserByEmail = await this.usersService.findUserByEmail(data.email);
      const findDuplicateUserByUsername = await this.usersService.findUserByUsername(data.user)
      if (findDuplicateUserByEmail) {
        return {
          statusCode: 409,
          message: `Email ${findDuplicateUserByEmail.email} has been exist`
        }
      }
      if (findDuplicateUserByUsername) {
        return {
          statusCode: 409,
          message: `User ${findDuplicateUserByUsername.user} has been exist`,
        };
      }
      const { success, error } = await this.usersService.createAccount(data);
      if (!success && error) {
        return {
          statusCode: 500,
          error: error,
          message: "Internal Server Error"
        }
      }
      return {
        statusCode: 201,
        message: `User ${data.user} has been succesfully created`,
      };
    } catch (err) {
      return {
        statusCode: 500,
        error: err,
      };
    }
  }

  async getNewAccessToken(cookie: any): Promise<response> {
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
      const user = await this.rTokenService.findTokenFromToken(cookie.refreshToken)

      if (user == null) {
        // CEK APAKAH PERNAH PUNYA TOKEN TAPI DULU

        const decoded = await this.jwtService.verifyAsync(cookie.refreshToken)
        console.log(decoded)
        if (decoded) {
          const HACKED_USER = await this.usersService.findUserById(decoded.user_id)
          await this.rTokenService.deleteAllToken(user.data.refreshToken_id)
          return {
            statusCode: 204,
            message: "Delete cookie"
          }
        }

      }


      else {
        const checkUserIsVerify = await this.jwtService.verifyAsync(
          cookie.refreshToken,
        );
        console.log(checkUserIsVerify);
        if (!checkUserIsVerify) {
          await this.rTokenService.deleteToken(user.data.refreshToken_id, cookie.refreshToken)

          return { statusCode: 204, message: 'No Content' };
        } else if (
          checkUserIsVerify.user === user.data.user &&
          checkUserIsVerify.email === user.data.email
        ) {
          // give new accessToken
          const accessToken = await this.jwtService.signAsync(
            {
              user_id: user.data.id,
              email: user.data.email,
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
      const user = await this.rTokenService.findTokenFromToken(cookie.refreshToken)

      console.log(user);
      if (!user.data.refreshToken) {
        return {
          statusCode: 204,
          message: "token wrong"
        };
      }
      const decode = await this.jwtService.verifyAsync(cookie.refreshToken)

      if (!decode) {
        return { statusCode: 403, message: "cookie wrong" }
      }
      await this.rTokenService.deleteToken(decode.user_id, cookie.refreshToken)
      
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
