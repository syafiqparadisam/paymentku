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
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
// import * as winston from 'winston';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      entities: [Users, Profile, HistoryTopup, HistoryTransfer, Notification],
      host: process.env.DB_HOST,
      poolSize: 10,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWD,
      database: process.env.DB_DBNAME,
      synchronize: true,
    }),
    WinstonModule.forRoot({
      transport: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
              processId: true
            }),
          ),
        }),
      ]
    }),
    UsersModule,
    AuthModule,
    AccessTokenGuardModule,
    RedisModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    CloudinaryModule,
  ],
})
export class AppModule { }
