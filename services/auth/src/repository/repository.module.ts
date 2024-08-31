import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RepositoryService } from './repository.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [RepositoryService],
  exports: [RepositoryService],
})
export class RepositoryModule {}
