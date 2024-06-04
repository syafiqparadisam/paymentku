import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EmailDto,
  NewPWDTO,
  VerifyDeleteAccount,
  loginRequest,
  loginWithGoogle,
  registerRequest,
  verifyPasswordDTO,
} from './dtos/request';
import { response } from '../interfaces/response';
import { UsersService } from '../users/users.service';
import * as nodemailer from 'nodemailer';
import { RedisService } from '../redis/redis.service';
import * as crypto from 'node:crypto';
import ejs from 'ejs';
import fs from 'node:fs/promises';
import path from 'node:path';
import jwtPayload from '../interfaces/jwtPayload';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly configService: ConfigService,
    private redisService: RedisService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async signInWithGoogle(
    payload: loginWithGoogle,
    cookies: any,
    res: any,
  ): Promise<response> {
    try {
      const lockKey = crypto.randomUUID() + payload.name;

      // if authToken exist in cookie, delete it
      if (cookies.authToken) {
        await this.redisService.deleteToken(cookies.authToken, [lockKey]);
        res.clearCookie('authToken', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });
      }

      // find user is already exist in database ?
      const user = await this.usersService.findUserByEmail(payload.email);
      let authToken = this.generateRandomString(150);

      // check token, is conflict in the database, before store it in database ??
      const isTokenExist = await this.redisService.isAuthTokenAlreadyExist(
        authToken,
        [lockKey],
      );
      while (isTokenExist) {
        authToken = this.generateRandomString(150);
      }

      // if user is new and never login before then create Account
      if (!user) {
        await this.usersService.createAccountWithGoogle(payload);
        const userAfterCreateAccount = await this.usersService.findUserByEmail(
          payload.email,
        );

        // store auth token to redis
        await this.redisService.addAuthTokenWithExpire(
          authToken,
          [lockKey],
          userAfterCreateAccount.id,
        );

        return {
          statusCode: HttpStatus.OK,
          data: { authToken },
          message: 'Successfully signin',
        };
      }

      // handle user has been login before

      // empty password if user signin with google
      if (user.password != null) {
        await this.usersService.emptyPassword(user.id);
      }

      // update photo profile or name if photo profile and name is null
      const userAndprofile = await this.usersService.joiningUserAndProfile(
        user.id,
      );
      if (userAndprofile.profile.name == null) {
        await this.usersService.updateName(
          userAndprofile.profile.id,
          payload.name,
        );
      }
      if (userAndprofile.profile.photo_profile == null) {
        await this.usersService.updatePhotoProfile(
          payload.picture,
          userAndprofile.profile.id,
          '',
        );
      }

      // store auth token to redis
      await this.redisService.addAuthTokenWithExpire(
        authToken,
        [lockKey],
        user.id,
      );

      return {
        statusCode: HttpStatus.OK,
        data: { authToken },
        message: 'Successfully signin',
      };
    } catch (err) {
      throw err;
    }
  }

  generateRandomString(length) {
    const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  async signIn(
    payload: loginRequest,
    cookies: any,
    res: any,
  ): Promise<response> {
    try {
      const lockKey = crypto.randomUUID() + payload.user;

      // find user and check password
      const user = await this.usersService.findUserByUsername(payload.user);
      if (user == null || !user) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Wrong Username or Password',
        };
      }
      const comparePass = await this.usersService.comparePassword(
        payload.password,
        user.password,
      );
      if (comparePass == false) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Wrong Username or Password',
        };
      }

      // if authToken exist in cookie, delete it
      if (cookies.authToken) {
        await this.redisService.deleteToken(cookies.authToken, [lockKey]);
        res.clearCookie('authToken', {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
        });
      }

      const authToken = await this.generateRandomString(150);

      // check token, is conflict in the database, before store it ??
      const { authToken: newAuthToken } = await this.isAuthTokenExistInDB(
        authToken,
        lockKey,
      );

      // store token
      await this.redisService.addAuthTokenWithExpire(
        newAuthToken,
        [lockKey],
        user.id,
      );

      return {
        statusCode: HttpStatus.OK,
        data: { authToken },
        message: 'Successfully signin',
      };
    } catch (err) {
      throw err;
    }
  }

  async isAuthTokenExistInDB(
    authToken: string,
    lockKey: string,
  ): Promise<{ authToken: string }> {
    let newAuthToken = authToken;
    const isTokenExist = await this.redisService.isAuthTokenAlreadyExist(
      authToken,
      [lockKey],
    );
    while (isTokenExist) {
      newAuthToken = await this.generateRandomString(150);
      const newLockKey = crypto.randomUUID();
      this.isAuthTokenExistInDB(authToken, newLockKey);
    }
    return { authToken: newAuthToken };
  }

  async createAccount(
    data: registerRequest,
    cookies: any,
    res,
  ): Promise<response> {
    const lockKey = crypto.randomUUID() + data.user;

    // if authToken in cookie, delete it
    if (cookies.authToken) {
      await this.redisService.deleteToken(cookies.authToken, [lockKey]);
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
    }

    try {
      const findDuplicateUserByEmail = await this.usersService.findUserByEmail(
        data.email,
      );
      const findDuplicateUserByUsername =
        await this.usersService.findUserByUsername(data.user);
      if (findDuplicateUserByEmail) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: `Email ${findDuplicateUserByEmail.email} has been exist`,
        };
      }
      if (findDuplicateUserByUsername) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: `User ${findDuplicateUserByUsername.user} has been exist`,
        };
      }
      await this.usersService.createAccount(data);

      return {
        statusCode: HttpStatus.CREATED,
        message: `User ${data.user} has been successfully created`,
      };
    } catch (err) {
      throw err;
    }
  }

  async logout(cookie, res): Promise<response> {
    // if authToken doesn't have, user is delete the cookie
    if (!cookie.authToken) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: "User don't have token but tried to logout",
      };
    }

    try {
      const lockKey = crypto.randomUUID();

      const userid = await this.redisService.getUserIdByAuthToken(
        cookie.authToken,
        [lockKey],
      );

      // if userid not found, invalid token !!
      if (!userid) {
        res.clearCookie('authToken', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'User not found but tried to logout',
        };
      }

      // delete token from db
      await this.redisService.deleteToken(cookie.authToken, [lockKey]);

      return {
        statusCode: 204,
      };
    } catch (error) {
      throw error;
    }
  }

  async getPasswordResetToken(
    emailDto: EmailDto,
    cookie: any,
    res,
    token: string,
  ): Promise<response> {
    const lockKey = crypto.randomUUID() + emailDto.email;
    try {
      const user = await this.usersService.findUserByEmail(emailDto.email);

      if (!user?.email) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Email haven't registered",
        };
      }

      // delete refresh token, because user doesn't receive new token while forgot password
      if (cookie.authToken) {
        await this.redisService.deleteToken(cookie.authToken, [lockKey]);
        res.clearCookie('authToken', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });
      }

      // check is user have pwtoken before
      const isUserHavePWToken = await this.redisService.getPWToken(token, [
        lockKey,
      ]);
      if (isUserHavePWToken) {
        await this.redisService.deletePWToken(token, [lockKey]);
        res.clearCookie('pwToken', {
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        });
      }

      // generate pw reset token
      const pwResetToken = crypto.randomUUID();

      // config for url who user will be redirecting to frontend
      const frontendURL = this.configService.get<string>('FRONTEND');
      const redirectedURL = `${frontendURL}/passwordReset?token=${pwResetToken}`;

      // INSERT TO REDIS
      await this.redisService.insertPWToken(pwResetToken, user.id.toString(), [
        lockKey,
      ]);

      const smtpLogin = this.configService.get<string>('SMTP_LOGIN');
      const smtpKey = this.configService.get<string>('SMTP_KEY');

      // config nodemailer in brevo
      const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        from: 'syafiqparadisam@gmail.com',
        secure: false,
        dnsTimeout: 1000,
        auth: {
          user: smtpLogin,
          pass: smtpKey,
        },
      });

      // verify config nodemailer
      const ok = await transporter.verify();
      if (!ok) {
        throw new Error('Config on smtp email is wrong');
      }

      const emailTemplatePath = path.join(
        __dirname,
        '..',
        '..',
        'src',
        'mail',
        'templates',
        'resetPassword.ejs',
      );
      const emailTemplate = await fs.readFile(emailTemplatePath, {
        encoding: 'utf8',
      });
      // create email template in gmail
      const emailOptions = {
        from: smtpLogin,
        to: emailDto.email,
        subject: 'Please confirm your reset password',
        html: ejs.render(emailTemplate, {
          user: user.user,
          URL: redirectedURL,
        }),
      };

      // sending email
      await transporter.sendMail(emailOptions);
      res.cookie('pwToken', pwResetToken, {
        expires: new Date(new Date().getTime() + 5 * 60 * 1000),
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message:
          'Sending password reset token to your email, Please check your email',
      };
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(newPwDTo: NewPWDTO, token: string): Promise<response> {
    if (newPwDTo.confirmPassword != newPwDTo.password) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Please confirm your password as same as your password on top',
      };
    }

    const lockKey = crypto.randomUUID();
    try {
      // get user by userid
      const id = await this.redisService.getPWToken(token, [lockKey]);
      if (!id) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid token or already expired',
        };
      }

      // update new password
      await this.usersService.updatePassword(newPwDTo.password, Number(id));

      // delete password token, after password updated
      await this.redisService.deletePWToken(token, [lockKey]);

      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully updated password, you can try to login again',
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyAndUpdateUsername(
    dto: verifyPasswordDTO,
    userData: jwtPayload,
  ): Promise<response> {
    try {
      const user = await this.usersService.findUserById(userData.user_id);

      // if username equal to previous username, it hasn't changes
      if (dto.username == user.user) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Nothing to update',
        };
      }

      // check if password don't  have or null, just skip validate password
      if (user.password != null) {
        // validate password
        const checkPassword = await this.usersService.comparePassword(
          dto.password,
          user.password,
        );
        if (!checkPassword) {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Failed when update username, Please check your password',
          };
        }
      }

      // check is username already use by another people
      const findUsername = await this.usersService.findUserByUsername(
        dto.username,
      );
      if (findUsername && user.user != dto.username) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Username is already exist',
        };
      }

      // updating username
      await this.usersService.updateUsername(userData.user_id, dto.username);
      return { statusCode: HttpStatus.OK, message: 'Successfully update username' };
    } catch (error) {
      throw error;
    }
  }

  async deleteAccount(
    userData: jwtPayload,
    cookie: any,
    verifyDeletePayload: VerifyDeleteAccount,
    res,
  ): Promise<response> {
    const lockKey = crypto.randomUUID();
    try {
      const user = await this.usersService.findUserById(userData.user_id);

      // check if password don't  have or null, just skip validate password
      if (user.password != null) {
        const comparePass = await this.usersService.comparePassword(
          verifyDeletePayload.password,
          user.password,
        );
        if (!comparePass) {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Failed when delete account, Please check your password',
          };
        }
      }

      // delete authToken from db and cookie
      await this.redisService.deleteToken(cookie.authToken, [lockKey]);
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      // delete user data
      const join = await this.usersService.joiningUserAndProfile(
        userData.user_id,
      );
      await this.usersService.deleteAccount(userData.user_id, join.profile.id);

      return { statusCode: HttpStatus.OK, message: 'Successfully to delete' };
    } catch (error) {
      throw error;
    }
  }

  async updatePhotoProfile(
    userData: jwtPayload,
    pathUploadfile: string,
    publicIdImg: string,
  ): Promise<response> {
    try {

      // upload file to cloudinary
      const result = await this.cloudinaryService.uploadImage(pathUploadfile);

      // update url and publicid to database
      const joinUserAndProfile = await this.usersService.joiningUserAndProfile(
        userData.user_id,
      );
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
