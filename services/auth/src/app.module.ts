import { Module, Logger } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuardModule } from './access-token-guard/access-token-guard.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { WinstonModule } from 'nest-winston';
import { transports } from 'winston';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { mysqlOptionRunner } from './ormconfig';
import { ProfileModule } from './profile/profile.module';
import { DataSource } from 'typeorm';
import { mysqlOptionRunner } from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(mysqlOptionRunner),
    WinstonModule.forRoot({
      transports: [new transports.Console({ level: 'info' })],
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
    ProfileModule,
  ],
  providers: [Logger],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
