import { Module, Logger } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuardModule } from './access-token-guard/access-token-guard.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { WinstonModule } from 'nest-winston';
import { transports } from 'winston';
import { DrizzleMySqlModule } from '@knaadh/nestjs-drizzle-mysql2';
import { RepositoryModule } from './repository/repository.module';
import { mysqlConfig } from './config/mysql-config';

@Module({
  imports: [
    DrizzleMySqlModule.register({
      tag: 'SDGDS',
      ...mysqlConfig,
    }),
    WinstonModule.forRoot({
      transports: [new transports.Console({ level: 'info' })],
    }),
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
    RepositoryModule,
  ],
  providers: [Logger],
})
export class AppModule {}
