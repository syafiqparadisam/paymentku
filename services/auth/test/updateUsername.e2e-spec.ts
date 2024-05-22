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
  loginRequest,
  registerRequest,
  updateUsernameDTO,
} from 'src/auth/dtos/request';
import { response } from 'src/interfaces/response';
import { parsingCookie } from './utils';
import crypto from 'crypto';

describe('Update username Controller (e2e) PATCH /api/v1/username', () => {
  let app: INestApplication;
  let userSvc: UsersService;
  let redisSvc: RedisService;
  let loginDto: loginRequest;
  let userRegister: registerRequest;
  let cookies;
  let updateUsername: updateUsernameDTO;

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
      user: 'brooo',
      password: '12345678',
      email: 'bro@gmail.com',
    };

    // create user
    await userSvc.createAccount(userRegister);
  });

  // login before each test
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
      // updateUsername.username = userRegister.user
      const user = await userSvc.findUserByUsername(updateUsername.username);
      const userAndProfile = await userSvc.joiningUserAndProfile(user.id);
      await userSvc.deleteAccount(user.id, userAndProfile.profile.id);

      await app.close();
    } catch (error) {
      console.log(error);
    }
  });

  it('should return 400, update username failed password is wrong', async () => {
    updateUsername = {
      username: 'haii brooo wkwkk',
      password: 'i223fhf09ru02',
    };

    const response: response = {
      statusCode: 400,
      message: 'Failed when update username, Please check your password',
    };

    const req = await request(app.getHttpServer())
      .patch('/api/v1/username')
      .send(updateUsername)
      .set('Cookie', cookies)
      .set('Content-type', 'application/json');

    expect(req.statusCode).toBe(response.statusCode);
    expect(req.body).toMatchObject(response);
  });

  it('should return 200, update username success, but nothing to update', async () => {
    updateUsername = {
      username: userRegister.user,
      password: userRegister.password,
    };

    const response: response = {
      statusCode: 200,
      message: 'Nothing to update',
    };

    const req = await request(app.getHttpServer())
      .patch('/api/v1/username')
      .send(updateUsername)
      .set('Cookie', cookies)
      .set('Content-type', 'application/json');

    expect(req.statusCode).toBe(response.statusCode);
    expect(req.body).toMatchObject(response);
  });

  it('should return 409, username is already use by other people', async () => {
    const user2: registerRequest = {
      user: 'safiq',
      password: '12345678',
      email: 'erw@gmail.com',
    };

    await userSvc.createAccount(user2);

    updateUsername = {
      username: user2.user,
      password: userRegister.password,
    };

    const response: response = {
      statusCode: 409,
      message: 'Username is already exist',
    };

    const req = await request(app.getHttpServer())
      .patch('/api/v1/username')
      .send(updateUsername)
      .set('Cookie', cookies)
      .set('Content-type', 'application/json');

    expect(req.statusCode).toBe(response.statusCode);
    expect(req.body).toMatchObject(response);

    const user = await userSvc.findUserByUsername(user2.user);
    const userAndProfile = await userSvc.joiningUserAndProfile(user.id);
    await userSvc.deleteAccount(user.id, userAndProfile.profile.id);
  });

  it('should return 200, update username successfully', async () => {
    const response: response = {
      statusCode: 200,
      message: 'Successfully update username',
    };

    updateUsername = {
      username: 'mas afiq',
      password: userRegister.password,
    };

    const req = await request(app.getHttpServer())
      .patch('/api/v1/username')
      .send(updateUsername)
      .set('Cookie', cookies)
      .set('Content-type', 'application/json');

    // make user that dto.username is equal with user username who has been updated
    const user = await userSvc.findUserByUsername(updateUsername.username);

    expect(user.user).toEqual(updateUsername.username);
    expect(req.statusCode).toBe(response.statusCode);
    expect(req.body).toMatchObject(response);
  });
});
