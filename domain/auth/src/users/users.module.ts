import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './schemas/users.entity';
import { RefreshTokenModule } from 'src/refreshToken/refreshToken.module';
import { RefreshTokenService } from 'src/refreshToken/refreshToken.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), RefreshTokenModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
