import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { UsersModule } from '../src/users/users.module';
import cookieParser from 'cookie-parser';
import { registerRequest } from 'src/auth/dtos/request';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('Register Controller (e2e) POST /api/v1/register', () => {
  let app: INestApplication;
  let userSvc: UsersService;
  let registerSuccess: registerRequest;
  let registerWrongEmail: registerRequest;
  let registerPasswordLengthLess8: registerRequest;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule, ConfigModule.forRoot()],
    }).compile();
    configService = moduleFixture.get<ConfigService>(ConfigService);
    app = moduleFixture.createNestApplication();
    userSvc = moduleFixture.get<UsersService>(UsersService);
    app.use(cookieParser());
    await app.init();
  });

  // delete user from db after each test
  afterAll(async () => {
    try {
      const user = await userSvc.findUserByUsername(registerSuccess.user);
      const userAndProfile = await userSvc.joiningUserAndProfile(user.id);
      await userSvc.deleteAccount(user.id, userAndProfile.data.profile.id);
      await app.close();
    } catch (error) {
      console.log(error);
    }
  });

  //
  it('should return 400, register with wrong validation email', async () => {
    registerWrongEmail = {
      user: 'syafiq',
      password: '12345678',
      email: 'syafiqgmail.com',
    };

    const response = {
      statusCode: 400,
      message: ['email must be an email'],
      error: 'Bad Request',
    };

    const req = await request(app.getHttpServer())
      .post('/api/v1/register')
      .send(registerWrongEmail)
      .set('Content-type', 'application/json');

    expect(req.statusCode).toBe(400);
    expect(req.body).toMatchObject(response);
  });

  it('should return 400, register with wrong validation password less than 8 character', async () => {
    registerPasswordLengthLess8 = {
      user: 'syafiq',
      password: '5678',
      email: 'syafiq@gmail.com',
    };

    const response = {
      statusCode: 400,
      message: ['password must be longer than or equal to 8 characters'],
      error: 'Bad Request',
    };

    const req = await request(app.getHttpServer())
      .post('/api/v1/register')
      .send(registerPasswordLengthLess8)
      .set('Content-type', 'application/json');

    expect(req.header['content-type']).toContain('application/json');
    expect(req.statusCode).toBe(400);
    expect(req.body).toMatchObject(response);
  });

  it('should return 201, register success', async () => {
    registerSuccess = {
      user: 'syafiq',
      password: '12345678',
      email: 'syafiq@gmail.com',
    };

    const response = {
      statusCode: 201,
      message: `User ${registerSuccess.user} has been successfully created`,
    };

    const req = await request(app.getHttpServer())
      .post('/api/v1/register')
      .send(registerSuccess)
      .set('Content-type', 'application/json');

    // find user data
    const isUserAlreadyInDB = await userSvc.findUserByEmail(
      registerSuccess.email,
    );
    const joinWithProfile = await userSvc.joiningUserAndProfile(
      isUserAlreadyInDB.id,
    );
    const photoProfile = configService.get<string>('USER_ICON_DEFAULT');

    expect(isUserAlreadyInDB.id).toBeTruthy();
    expect(isUserAlreadyInDB.user).toEqual(registerSuccess.user);
    expect(isUserAlreadyInDB.password).toBeTruthy();
    expect(isUserAlreadyInDB.email).toEqual(registerSuccess.email);
    expect(isUserAlreadyInDB.balance).toEqual('0');
    expect(joinWithProfile.data.profile.id).toBeTruthy();
    expect(joinWithProfile.data.profile.bio).toBeNull();
    expect(joinWithProfile.data.profile.name).toBeTruthy();
    expect(joinWithProfile.data.profile.phone_number).toBeNull();
    expect(joinWithProfile.data.profile.photo_profile).toEqual(photoProfile);
    expect(req.statusCode).toBe(201);
    expect(req.body).toMatchObject(response);
  });

  it('should return 409, register when account with same email already exist', async () => {
    registerSuccess.email = 'syafiq@gmail.com';

    const req = await request(app.getHttpServer())
      .post('/api/v1/register')
      .send(registerSuccess)
      .set('Content-type', 'application/json');

    const response = {
      statusCode: 409,
      message: `Email ${registerSuccess.email} has been exist`,
    };

    expect(req.header['content-type']).toContain('application/json');
    expect(req.statusCode).toBe(response.statusCode);
    expect(req.body).toEqual(response);
  });

  it('should return 409, register when account with same username already exist', async () => {
    registerSuccess.email = 'fasda@gmail.com';
    registerSuccess.user = 'syafiq';

    const req = await request(app.getHttpServer())
      .post('/api/v1/register')
      .send(registerSuccess)
      .set('Content-type', 'application/json');

    const response = {
      statusCode: 409,
      message: `User ${registerSuccess.user} has been exist`,
    };

    expect(req.header['content-type']).toContain('application/json');
    expect(req.statusCode).toBe(response.statusCode);
    expect(req.body).toEqual(response);
  });
});
