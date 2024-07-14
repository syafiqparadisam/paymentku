import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './schemas/users.entity';
import { HistoryTopup } from './schemas/history_topup.entity';
import { HistoryTransfer } from './schemas/history_transfer.entity';
import { Profile } from './schemas/profile.entity';
import { Notification } from './schemas/notification.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Profile,
      HistoryTopup,
      HistoryTransfer,
      Notification,
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
