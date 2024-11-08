import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

import { GoogleStrategy } from './strategies/google.strategy';
import { AccessTokenGuardModule } from '../access-token-guard/access-token-guard.module';
import { RedisModule } from '../redis/redis.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [UsersModule, AccessTokenGuardModule, RedisModule, CloudinaryModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
