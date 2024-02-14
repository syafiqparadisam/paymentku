import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { RefreshTokenModule } from 'src/refreshToken/refreshToken.module';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenGuardModule } from 'src/access-token-guard/access-token-guard.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    RefreshTokenModule,
    AccessTokenGuardModule,
    RedisModule
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule { }
