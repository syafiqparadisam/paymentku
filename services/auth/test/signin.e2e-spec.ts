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
import crypto from 'crypto';
import { parsingCookie } from './utils';

describe('Signin Controller with manual input (e2e) POST /api/v1/login', () => {
  let app: INestApplication;
  let userSvc: UsersService;
  let redisSvc: RedisService;
  let loginDto: loginRequest;
  let userRegister: registerRequest;
  let cookies;

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

    // create user
    userRegister = {
      user: 'matamua',
      password: '12345678',
      email: 'matamua@gmail.com',
    };
    await userSvc.createAccount(userRegister);
  });

  // delete user and authToken from db after each test
  afterAll(async () => {
    try {
      const user = await userSvc.findUserByUsername(userRegister.user);
      const userAndProfile = await userSvc.joiningUserAndProfile(user.id);
      await userSvc.deleteAccount(user.id, userAndProfile.profile.id);

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

      await app.close();
    } catch (error) {
      console.log(error);
    }
  });

  it('should return 400, login with wrong username', async () => {
    loginDto = {
      user: 'salah username',
      password: userRegister.password,
    };

    const req = await request(app.getHttpServer())
      .post('/api/v1/login')
      .send(loginDto)
      .set('Content-type', 'application/json');

    const response: response = {
      statusCode: 400,
      message: 'Wrong Username or Password',
    };

    expect(req.header['content-type']).toContain('application/json');
    expect(req.statusCode).toBe(response.statusCode);
    expect(req.body).toMatchObject(response);
  });

  it('should return 400, login with wrong password', async () => {
    loginDto = {
      user: userRegister.user,
      password: '2342hi2h3r32',
    };

    const req = await request(app.getHttpServer())
      .post('/api/v1/login')
      .send(loginDto)
      .set('Content-type', 'application/json');

    const response: response = {
      statusCode: 400,
      message: 'Wrong Username or Password',
    };

    expect(req.header['content-type']).toContain('application/json');
    expect(req.statusCode).toBe(response.statusCode);
    expect(req.body).toMatchObject(response);
  });

  it('should return 200, login successfully and get authToken cookie', async () => {
    loginDto = {
      user: userRegister.user,
      password: userRegister.password,
    };

    const response: response = {
      statusCode: 200,
      message: 'Successfully signin',
    };

    const req = await request(app.getHttpServer())
      .post('/api/v1/login')
      .send(loginDto)
      .set('Content-type', 'application/json')
      .set('Cookie', cookies == null ? null : cookies);

    cookies = req.header['set-cookie'];
    const objCookie = parsingCookie(cookies[0]);

    expect(req.header['set-cookie'][0]).toBeTruthy();
    expect(objCookie.value).toContain('authToken');
    expect(objCookie.value.slice(10, objCookie.value.length)).toBeTruthy();
    expect(objCookie.sameSite).toContain('None');
    expect(objCookie.path).toBe('/');
    expect(objCookie.httpOnly).toBe('HttpOnly');
    expect(objCookie.secure).toBe('Secure');
    expect(objCookie.exp).toBeTruthy();
    expect(req.header['content-type']).toContain('application/json');
    expect(req.statusCode).toBe(200);
    expect(req.body).toMatchObject(response);
  });

  it('should return 200, login success and get a new authToken cookie then old cookie should be empty', async () => {
    loginDto = {
      user: userRegister.user,
      password: userRegister.password,
    };

    const response: response = {
      statusCode: 200,
      message: 'Successfully signin',
    };

    const req = await request(app.getHttpServer())
      .post('/api/v1/login')
      .send(loginDto)
      .set('Content-type', 'application/json')
      .set('Cookie', cookies == null ? null : cookies);

    cookies = req.header['set-cookie'];
    const objCookieNullValue = parsingCookie(cookies[0]);

    // old authToken cookie expect
    expect(req.header['set-cookie'][0]).toBeTruthy();
    expect(objCookieNullValue.value).toContain('authToken');
    expect(
      objCookieNullValue.value.slice(10, objCookieNullValue.value.length),
    ).toBe('');
    expect(objCookieNullValue.sameSite).toContain('None');
    expect(objCookieNullValue.path).toBe('/');
    expect(objCookieNullValue.httpOnly).toBe('HttpOnly');
    expect(objCookieNullValue.secure).toBe('Secure');
    expect(objCookieNullValue.exp).toBeTruthy();

    const objCookie = parsingCookie(cookies[1]);

    // new authToken cookie expect
    expect(req.header['set-cookie'][1]).toBeTruthy();
    expect(objCookie.value).toContain('authToken');
    expect(objCookie.value.slice(10, objCookie.value.length)).toBeTruthy();
    expect(objCookie.sameSite).toContain('None');
    expect(objCookie.path).toBe('/');
    expect(objCookie.httpOnly).toBe('HttpOnly');
    expect(objCookie.secure).toBe('Secure');
    expect(objCookie.exp).toBeTruthy();
    expect(req.header['content-type']).toContain('application/json');
    expect(req.statusCode).toBe(200);
    expect(req.body).toMatchObject(response);
  });
});
