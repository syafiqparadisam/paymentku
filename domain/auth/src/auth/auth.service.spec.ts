import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { registerRequest } from './dtos/request';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
        }),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        UsersModule,
      ],
      controllers: [AuthController],
      providers: [AuthService, GoogleStrategy],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    const dto: registerRequest = {
      user: 'woybro',
      email: "a@gmail.com",
      password: "12345678"
    };


    expect(service.createAccount);
  });
});
