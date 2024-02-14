import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailDto, loginRequest, loginWithGoogle, registerRequest } from './dtos/request';
import { response } from '../interfaces/response';
import { UsersService } from '../users/users.service';
import { jwtPayload } from 'src/interfaces/jwtPayload';
import { RefreshTokenService } from 'src/refreshToken/refreshToken.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rTokenService: RefreshTokenService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService
  ) { }


  generateRandObj(): void {

  }
  async generateJWT(payload: any | jwtPayload, expiresIn: number | string): Promise<string> {
    return await this.jwtService.signAsync(payload, { secret: this.configService.get<string>("JWT_SECRET"), expiresIn })
  }

  async verifyJWT(token: string): Promise<jwtPayload> {
    return await this.jwtService.verifyAsync(token, { secret: this.configService.get<string>("JWT_SECRET") })
  }

  async signInWithGoogle(payload: loginWithGoogle, cookies: any): Promise<response> {
    if (!payload) {
      return {
        statusCode: 400,
        message: "Field is null"
      }
    }
    // find user
    const findDuplicateUserByEmail = await this.usersService.findUserByEmail(payload.email);
    const findDuplicateUserByUsername = await this.usersService.findUserByUsername(payload.username)

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
        const accessToken = await this.generateJWT({ user_id: findUser.id, email: findUser.email }, 3600 * 24 * 7)

        const refreshToken = await this.generateJWT({ user_id: findUser.id, email: findUser.email }, 3600 * 24 * 30)

        await this.rTokenService.add(findDuplicateUserByUsername.refreshToken_id, refreshToken)

        return {
          statusCode: 200,
          data: { accessToken, refreshToken },
          message: "Ok"
        }
      }
    }
    // just update photo profile if photo profile null and update they name if null
    // still error
    const userAndprofile = await this.usersService.joiningUserAndProfile(findDuplicateUserByUsername.id)
    console.log(userAndprofile.data.profile.id)
    if (userAndprofile.data.profile.name == null) {
      await this.usersService.updateName(userAndprofile.data.profile.id, payload.name)
    }
    if (userAndprofile.data.profile.photo_profile == null) {
      await this.usersService.updatePhotoProfile(userAndprofile.data.profile.id, payload.picture)
    }
    // user exist in databaase so just give them token
    const accessToken = await this.generateJWT({ user_id: findDuplicateUserByUsername.id, email: findDuplicateUserByUsername.email }, 3600 * 24 * 7)
    const refreshToken = await this.generateJWT({ user_id: findDuplicateUserByUsername.id, email: findDuplicateUserByUsername.email }, 3600 * 24 * 30)

    // check is user have cookie refreshToken before then just delete because we will put new cookie into them
    cookies.refreshToken ? await this.rTokenService.findTokenAndDelete(findDuplicateUserByUsername.refreshToken_id, cookies.refreshToken) : null


    await this.rTokenService.add(findDuplicateUserByUsername.refreshToken_id, refreshToken)

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
        const accessToken = await this.generateJWT({ user_id: user.id, email: user.email }, 3600 * 24 * 7)
        const refreshToken = await this.generateJWT({ user_id: user.id, email: user.email }, 3600 * 24 * 30)


        cookies.refreshToken ? await this.rTokenService.findTokenAndDelete(user.refreshToken_id, cookies.refreshToken) : null
        console.log(cookies.refreshToken)
        await this.rTokenService.add(user.refreshToken_id, refreshToken)
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

    console.log(data)
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
      const { success, data: error } = await this.usersService.createAccount(data);
      console.log({ success, error })
      if (!success) {
        return {
          statusCode: 500,
          error,
          message: "Internal Server Error"
        }
      }
      console.log(success)
      return {
        statusCode: 201,
        message: `User ${data.user} has been succesfully created`,
      };
    } catch (err) {
      console.log(err)
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
      const arrRefTokenUser = await this.rTokenService.findTokenFromToken(cookie.refreshToken)
      console.log(arrRefTokenUser)
      if (!arrRefTokenUser.data) {
        return {
          statusCode: 204,
          message: "Delete cookie"
        }
      }
      const user = await this.usersService.findUserByRefreshTokenId(arrRefTokenUser.data._id.toString())
      if (user == null) {
        return {
          statusCode: 204,
          message: "Delete cookie"
        }
      } else {
        const checkUserIsVerify = await this.verifyJWT(cookie.refreshToken)
        console.log(checkUserIsVerify);
        if (!checkUserIsVerify) {
          return { statusCode: 403, message: 'User found but this token is wrong' };
        } else if (
          checkUserIsVerify.user_id === user.id &&
          checkUserIsVerify.email === user.email
        ) {
          // give new accessToken
          const accessToken = await this.generateJWT({ user_id: checkUserIsVerify.user_id, email: checkUserIsVerify.email }, 3600 * 24 * 7)

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
    if (!cookie.refreshToken || cookie.refreshToken == null) {
      return {
        statusCode: 403,
        message: "User don't have refreshToken but tried to logout"
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
      const decode = await this.verifyJWT(cookie.refreshToken)

      if (!decode.user_id && !decode.email) {
        return { statusCode: 403, message: "refresh token is wrong" }
      }
      await this.rTokenService.deleteToken(user.data._id, cookie.refreshToken)
      return {
        statusCode: 204,
        message: "refresh token have been deleting now"
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: error,
      };
    }
  }

  async getPasswordResetToken(emailDto: EmailDto): Promise<response> {
    const user = await this.usersService.findEmailByEmail(emailDto.email)

    if (!user?.email) {
      return {
        statusCode: 404
      }
    }

    // generate JWT TOKEN
    const pwResetToken = await this.generateJWT({ user_id: user.id }, "2m")
    const values = {
      user_id: user.id,
      pwtoken: pwResetToken
    }
    // store to redis
    const setPWTokenIntoRedis = await this.redisService.setPWTokenWithExpiry("user:" + user.id + ":" + pwResetToken, values,)
  }
}
