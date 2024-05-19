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

describe('Logout Controller (e2e) DELETE /api/v1/logout', () => {
  let app: INestApplication;
  let userSvc: UsersService;
  let redisSvc: RedisService;
  let loginDto: loginRequest;
  let userRegister: registerRequest;
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
      user: 'brooo',
      password: '12345678',
      email: 'bro@gmail.com',
    };

    // create user
    await userSvc.createAccount(userRegister);
  });

  // login user before each test
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
      const user = await userSvc.findUserByUsername(userRegister.user);
      const userAndProfile = await userSvc.joiningUserAndProfile(user.id);
      await userSvc.deleteAccount(user.id, userAndProfile.data.profile.id);

      await app.close();
    } catch (error) {
      console.log(error);
    }
  });

  it("should return 403, logout failed, user don't have cookie name authToken", async () => {
    const response: response = {
      statusCode: 403,
      message: "User don't have token but tried to logout",
    };

    const req = await request(app.getHttpServer())
      .delete('/api/v1/logout')
      .set('Cookie', '');

    expect(req.header['content-type']).toContain('application/json');
    expect(req.statusCode).toBe(response.statusCode);
    expect(req.body).toMatchObject(response);
  });

  it('should return 403, logout failed authToken is empty or wrong', async () => {
    const response: response = {
      statusCode: 403,
      message: "User don't have token but tried to logout",
    };

    const req = await request(app.getHttpServer())
      .delete('/api/v1/logout')
      .set('Cookie', 'authToken=');

    expect(req.header['content-type']).toContain('application/json');
    expect(req.statusCode).toBe(response.statusCode);
    expect(req.body).toMatchObject(response);
  });

  it('should return 204, logout successfully', async () => {
    const req = await request(app.getHttpServer())
      .delete('/api/v1/logout')
      .set('Cookie', cookies);

    expect(req.noContent).toBeTruthy();
    expect(req.statusCode).toBe(204);
  });
});
