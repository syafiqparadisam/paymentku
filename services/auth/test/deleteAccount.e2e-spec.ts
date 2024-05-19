import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { UsersModule } from '../src/users/users.module';
import cookieParser from 'cookie-parser';
import { RedisService } from '../src/redis/redis.service';
import { RedisModule } from '../src/redis/redis.module';
import {
  VerifyDeleteAccount,
  loginRequest,
  registerRequest,
} from 'src/auth/dtos/request';
import { response } from 'src/interfaces/response';
import crypto from 'crypto';
import { parsingCookie } from './utils';

describe('Delete Controller (e2e) DELETE /api/v1/user', () => {
  let app: INestApplication;
  let userSvc: UsersService;
  let redisSvc: RedisService;
  let loginDto: loginRequest;
  let userRegister: registerRequest;
  let verifyPw: VerifyDeleteAccount;
  let cookies;

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
      user: 'brooo77',
      password: '12345678',
      email: 'bro9786@gmail.com',
    };

    // create user
    await userSvc.createAccount(userRegister);
  });

  //login user before each test
  beforeEach(async () => {
    loginDto = {
      user: userRegister.user,
      password: userRegister.password,
    };

    const req = await request(app.getHttpServer())
      .post('/api/v1/login')
      .send(loginDto)
      .set('Content-type', 'application/json');

    cookies = req.header['set-cookie'];
  });

  // delete authTooken after each test
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

  // after test ended, close the server
  afterAll(async () => {
    try {
      await app.close();
    } catch (error) {
      console.log(error);
    }
  });

  it('should return 400, delete failed, password is wrong', async () => {
    verifyPw = {
      password: '98724324242',
    };

    const response: response = {
      statusCode: 400,
      message: 'Failed when delete account, Please check your password',
    };

    const req = await request(app.getHttpServer())
      .delete('/api/v1/user')
      .send(verifyPw)
      .set('Cookie', cookies);

    expect(req.statusCode).toBe(response.statusCode);
    expect(req.body).toMatchObject(response);
  });

  it('should return 200, delete account successfully', async () => {
    const response: response = {
      statusCode: 200,
      message: 'Successfully to delete',
    };

    const verifyPWDelete = {
      password: userRegister.password,
    };

    const req = await request(app.getHttpServer())
      .delete('/api/v1/user')
      .send(verifyPWDelete)
      .set('Cookie', cookies);

    expect(req.statusCode).toBe(response.statusCode);
    expect(req.body).toMatchObject(response);
  });
});
