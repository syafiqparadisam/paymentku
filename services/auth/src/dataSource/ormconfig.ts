import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import dotenv from 'dotenv';
dotenv.config();

const mysqlOptionProd: MysqlConnectionOptions = {
  type: 'mysql',
  entities: ['./src/**/**/*.entity.{ts,js}'],
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


module.exports = [
  {
    type: 'mysql',
    entities: ['./src/**/**/*.entity.{ts,js}'],
    host: process.env.DB_HOST,
    poolSize: 10,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME,
    logging: true,
    migrations: ['**/migration/*.ts'],
  }
]

// console.log(mysqlOptionDev)

export default new DataSource(mysqlOptionProd);
