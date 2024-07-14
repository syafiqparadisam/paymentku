import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import dotenv from 'dotenv';
import { Users } from '../users/schemas/users.entity';
import { Profile } from '../users/schemas/profile.entity';
import { Notification } from '../users/schemas/notification.entity';
import { HistoryTopup } from '../users/schemas/history_topup.entity';
import { HistoryTransfer } from '../users/schemas/history_transfer.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Migration1718333322243 } from '../migration/1718333322243-Migration';
dotenv.config();

const mysqlOptionMigrate: MysqlConnectionOptions = {
  type: 'mysql',
  entities: ['./src/users/schemas/*.entity{.ts,.js}'],
  host: process.env.DB_HOST,
  poolSize: 10,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  database: process.env.DB_NAME,
  logging: true,
  synchronize: false,
  migrations: ['**/migration/*.ts'],
};

export const mysqlOptionRunner: TypeOrmModuleOptions = {
  type: 'mysql',
  entities: [Users, Profile, Notification, HistoryTopup, HistoryTransfer],
  host: process.env.DB_HOST,
  poolSize: 10,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  database: process.env.DB_NAME,
  logging: true,
  migrations: [Migration1718333322243],
};

export default new DataSource(mysqlOptionMigrate);
