import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UsersModule } from '../users/users.module';
import { AccessTokenGuardModule } from '../access-token-guard/access-token-guard.module';
import { RedisModule } from '../redis/redis.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProfileController],
  imports: [UsersModule, RedisModule, CloudinaryModule, AccessTokenGuardModule],
  providers: [ProfileService]
})
export class ProfileModule {}
