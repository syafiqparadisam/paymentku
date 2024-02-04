import { Module } from '@nestjs/common';
import { databaseProvider } from './mongorepo.provider';

@Module({
  providers: [...databaseProvider],
  exports: [...databaseProvider]
})
export class MongorepoModule {}
