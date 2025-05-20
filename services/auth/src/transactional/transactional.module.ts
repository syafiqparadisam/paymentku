import { Module } from '@nestjs/common';
import { TransactionalController } from './transactional.controller';
import { AccessTokenGuardModule } from '../access-token-guard/access-token-guard.module';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from '../redis/redis.module';

@Module({
  controllers: [TransactionalController],
  imports: [AccessTokenGuardModule, HttpModule, RedisModule],
})
export class TransactionalModule {}
