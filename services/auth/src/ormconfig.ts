import dotenv from 'dotenv';
import { Users } from './schemas/users.entity';
import { Profile } from './schemas/profile.entity';
import { Notification } from './schemas/notification.entity';
import { HistoryTopup } from './schemas/history_topup.entity';
import { HistoryTransfer } from './schemas/history_transfer.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
dotenv.config();

export let mysqlOptionRunner: TypeOrmModuleOptions = {
  type: 'mysql',
  entities: [Users, Profile, Notification, HistoryTopup, HistoryTransfer],
  host: process.env.DB_HOST,
  poolSize: 10,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  database: process.env.DB_NAME,
  logging: true,
  synchronize: process.env.NODE_ENV == 'production' ? false : true,
};
