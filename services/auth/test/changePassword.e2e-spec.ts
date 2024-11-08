import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { UsersModule } from '../src/users/users.module';
import cookieParser from 'cookie-parser';
import { EmailDto, NewPWDTO, registerRequest } from '../src/auth/dtos/request';
import { ConfigModule } from '@nestjs/config';
import { response } from '../src/interfaces/response';
import { RedisModule } from '../src/redis/redis.module';

describe('Change password Test (e2e) POST /api/v1/confirm/passwordReset PUT /api/v1/passwordChange/token?', () => {
  let app: INestApplication;
  let userSvc: UsersService;
  let userRegister: registerRequest;
  let newPW: NewPWDTO;
  let emailDto: EmailDto;
  let response: response;

  // initialize application and create user
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule, ConfigModule.forRoot(), RedisModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userSvc = moduleFixture.get<UsersService>(UsersService);

    app.use(cookieParser());
    await app.init();

    userRegister = {
      user: 'afiq',
      password: '12345678',
      email: 'afiqparadisam19@gmail.com',
    };

    // create user
    await userSvc.createAccount(userRegister);
  });

  // delete user from db after each test
  afterAll(async () => {
    try {
      const user = await userSvc.findUserByUsername(userRegister.user);
      const userAndProfile = await userSvc.joiningUserAndProfile(user.id);
      await userSvc.deleteAccount(user.id, userAndProfile.profile.id);
      await app.close();
    } catch (error) {
      console.log(error);
    }
  });

  it("should return 400, change password failed email isn't registered", async () => {
    response = {
      statusCode: 400,
      message: "Email haven't registered",
    };

    const req = await request(app.getHttpServer())
      .post('/api/v1/confirm/passwordReset')
      .send({ email: 'wrongEmail@gmail.com' });

    expect(req.statusCode).toEqual(response.statusCode);
    expect(req.body).toMatchObject(response);
  });

  it('should return 400, change password failed sending email to this user, but token is wrong', async () => {
    response = {
      statusCode: 200,
      message:
        'Sending password reset token to your email, Please check your email',
    };

    emailDto = {
      email: userRegister.email,
    };

    // send email to get pwToken
    const reqSendEmail = await request(app.getHttpServer())
      .post('/api/v1/confirm/passwordReset')
      .send(emailDto);

    expect(reqSendEmail.statusCode).toEqual(response.statusCode);
    expect(reqSendEmail.body).toMatchObject(response);

    response = {
      statusCode: 400,
      message: 'Invalid token or already expired',
    };

    newPW = {
      password: '876543210',
      confirmPassword: '876543210',
    };

    // updatePassword with wrong token
    const reqUpdatePass = await request(app.getHttpServer())
      .put('/api/v1/passwordChange?token=234222322')
      .send(newPW);

    expect(reqUpdatePass.statusCode).toEqual(response.statusCode);
    expect(reqUpdatePass.body).toMatchObject(response);
  });
});
