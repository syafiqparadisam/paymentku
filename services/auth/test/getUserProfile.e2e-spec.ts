import { AppModule } from '../src/app.module';
import { UsersModule } from '../src/users/users.module';
import { RedisModule } from '../src/redis/redis.module';
import { UsersService } from '../src/users/users.service';
import { RedisService } from '../src/redis/redis.service';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { loginRequest, registerRequest } from '../src/auth/dtos/request';
import cookieParser from 'cookie-parser';
import { parsingCookie } from './utils';
import request from 'supertest';
import { AccessTokenGuardGuard } from '../src/access-token-guard/access-token-guard.guard';
import { profile } from '../src/interfaces/profile';

describe('Get User Profile', () => {
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
      user: 'syafiq12',
      password: '12345678',
      email: 'syafiq12@gmail.com',
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

  it('Should return user', async () => {
    try {
      const res = await request(app.getHttpServer())
        .get('/api/v1/profile')
        .set('Cookie', cookies);

      const data = res.body.data;

	  const usr = await userSvc.findUserByUsername(userRegister.user)
      let profiles: profile | any = await userSvc.getUserProfile(usr.id);
      profiles.balance = Number(profiles.balance);
      profiles.accountNumber = Number(profiles.accountNumber);

      console.log(res.body);
      console.log(profiles);

      expect(res.status).toBe(200);
      expect(data.user).toBe(profiles.user);
      expect(data.name).toBe(profiles.name);
      expect(data.email).toBe(profiles.email);
      expect(data.accountNumber).toBe(profiles.accountNumber);
      expect(data.balance).toEqual(0);
      expect(data.bio).toBeNull();
      expect(data.created_at).toBe(profiles.created_at);
      expect(data.photo_profile).toBe(profiles.photo_profile);
      expect(data.photo_public_id).toBeNull();
      expect(data.phone_number).toBeNull();
    } catch (error) {
      const user = await userSvc.findUserByUsername(userRegister.user);
      const usrProfile = await userSvc.joiningUserAndProfile(user.id);
      await userSvc.deleteAccount(usrProfile.id, usrProfile.profile.id);
    }
  });
});
