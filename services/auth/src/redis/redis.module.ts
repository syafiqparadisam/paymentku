import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { redisClientFactory } from '../config/app-constant.options';

@Module({
  imports: [],
  providers: [redisClientFactory, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
