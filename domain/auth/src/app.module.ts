import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/schemas/users.entity';
import { RefreshTokenModule } from './refreshToken/refreshToken.module';
import { MongorepoModule } from './mongorepo/mongorepo.module';
import { Profile } from './users/schemas/profile.entity';
import { HistoryTopup } from './users/schemas/history_topup.entity';
import { HistoryTransfer } from './users/schemas/history_transfer.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      entities: [Users, Profile, HistoryTopup, HistoryTransfer],
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'paymentku',
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    RefreshTokenModule,
    MongorepoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
