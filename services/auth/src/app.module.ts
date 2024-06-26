import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/schemas/users.entity';
import { Profile } from './users/schemas/profile.entity';
import { HistoryTopup } from './users/schemas/history_topup.entity';
import { HistoryTransfer } from './users/schemas/history_transfer.entity';
import { AccessTokenGuardModule } from './access-token-guard/access-token-guard.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { Notification } from './users/schemas/notification.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      entities: [Users, Profile, HistoryTopup, HistoryTransfer, Notification],
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'paymentku',
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    AccessTokenGuardModule,
    RedisModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    CloudinaryModule,
  ],
})
export class AppModule {}
