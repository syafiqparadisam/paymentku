import { Module } from '@nestjs/common';
import { TransactionalController } from './transactional.controller';

@Module({
  controllers: [TransactionalController]
})
export class TransactionalModule {}
