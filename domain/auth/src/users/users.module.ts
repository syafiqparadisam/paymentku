import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './schemas/users.entity';
import { RefreshTokenModule } from 'src/refreshToken/refreshToken.module';
import { RefreshTokenService } from 'src/refreshToken/refreshToken.service';
import { HistoryTopup } from './schemas/history_topup.entity';
import { HistoryTransfer } from './schemas/history_transfer.entity';
import { Profile } from './schemas/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Profile, HistoryTopup, HistoryTransfer]), RefreshTokenModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
