import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { UsersModule } from '../src/users/users.module';
import cookieParser from 'cookie-parser';
import { RedisService } from '../src/redis/redis.service';
import { RedisModule } from '../src/redis/redis.module';
import { loginRequest, registerRequest } from 'src/auth/dtos/request';
import { response } from 'src/interfaces/response';
import { parsingCookie } from './utils';
import crypto from 'crypto';
import path from 'node:path';
import fs from 'node:fs';

describe('Update photo profile Controller (e2e) PATCH /api/v1/profile/photoprofile', () => {
  let app: INestApplication;
  let userSvc: UsersService;
  let redisSvc: RedisService;
  let loginDto: loginRequest;
  let userRegister: registerRequest;
  let cookies;
  let assetsMockPath: string;

  // server on
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule, RedisModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userSvc = moduleFixture.get<UsersService>(UsersService);
    redisSvc = moduleFixture.get<RedisService>(RedisService);

    app.use(cookieParser());
    app.enableCors();
    await app.init();

    userRegister = {
      user: 'ls-lah',
      password: '12345678',
      email: 'lahh@gmail.com',
    };
    assetsMockPath = path.join(__dirname, 'assets/');

    // create user
    await userSvc.createAccount(userRegister);
  });

  // login first before each test
  beforeEach(async () => {
    loginDto = {
      user: userRegister.user,
      password: userRegister.password,
    };

    const req = await request(app.getHttpServer())
      .post('/api/v1/login')
      .send(loginDto)
      .set('Content-type', 'application/json');

    cookies = req.headers['set-cookie'];
  });

  // delete authToken after each test
  afterEach(async () => {
    cookies as Array<string>;
    if (Array.isArray(cookies)) {
      cookies.map((cookie) => {
        const objCookie = parsingCookie(cookie);
        const lockKey = crypto.randomUUID();
        const deleteToken = async () => {
          return await redisSvc.deleteToken(
            objCookie.value.slice(10, objCookie.value.length),
            [lockKey],
          );
        };
        deleteToken();
      });
    }
  });

  // delete user from db after test ended
  afterAll(async () => {
    try {
      // delete user
      const user = await userSvc.findUserByUsername(userRegister.user);
      const userAndProfile = await userSvc.joiningUserAndProfile(user.id);
      await userSvc.deleteAccount(user.id, userAndProfile.profile.id);

      await app.close();
    } catch (error) {
      console.log(error);
    }
  });
  async function getPhotoPublicId(): Promise<string> {
    const user = await userSvc.findUserByUsername(userRegister.user);
    const joiningUserAndProfile = await userSvc.joiningUserAndProfile(user.id);
    return joiningUserAndProfile.profile.photo_public_id;
  }

  it('should return 200, update photo profile success', async () => {
    const response: response = {
      statusCode: 200,
      message: 'Photo profile has been changed',
    };
    const filePath = assetsMockPath + 'Mongodb.png';
    // check is assets mock exists ?
    if (fs.existsSync(filePath)) {
      const req = await request(app.getHttpServer())
        .patch('/api/v1/profile/photoprofile')
        .attach('image', filePath)
        .set('x-data-publicid', '')
        .set('Cookie', cookies);
      expect(req.statusCode).toBe(response.statusCode);
      expect(req.body).toMatchObject(response);
    }
  });

  it('should return 415, update photo profile failed, file is not allowed', async () => {
    const response: response = {
      statusCode: 415,
      message: 'File type application/postscript not allowed',
    };
    const filePath = assetsMockPath + '1307837.ai';

    // join user and profile table
    const photoPublicId = await getPhotoPublicId();

    // check is assets mock exists ?
    if (fs.existsSync(filePath)) {
      const req = await request(app.getHttpServer())
        .patch('/api/v1/profile/photoprofile')
        .attach('image', filePath)
        .set('x-data-publicid', photoPublicId)
        .set('Cookie', cookies);

      expect(req.statusCode).toBe(response.statusCode);
      expect(req.body).toMatchObject(response);
    }
  });

  it('should return 422, update photo profile failed, file is larger than 2mb size', async () => {
    const response: response = {
      statusCode: 422,
      message: 'Image should be less than 2 mb size',
    };

    const filePath = assetsMockPath + 'chooseus_fac0xl.png';
    const photoPublicId = await getPhotoPublicId();

    // check is assets mock exists ?
    if (fs.existsSync(filePath)) {
      const req = await request(app.getHttpServer())
        .patch('/api/v1/profile/photoprofile')
        .attach('image', filePath)
        .set('x-data-publicid', photoPublicId)
        .set('Cookie', cookies);

      expect(req.body).toMatchObject(response);
      expect(req.statusCode).toBe(response.statusCode);
    }
  });
});
