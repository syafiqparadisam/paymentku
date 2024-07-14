import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { redisClientFactory } from '../config/redis-config';

@Module({
  imports: [],
  providers: [redisClientFactory, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
