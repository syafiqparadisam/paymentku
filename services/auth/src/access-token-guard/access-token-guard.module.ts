import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
})
export class AccessTokenGuardModule {}
