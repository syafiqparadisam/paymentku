const { DataSource } = require('typeorm')
const { MysqlConnectionOptions } = require('typeorm/driver/mysql/MysqlConnectionOptions')
const dotenv  = require('dotenv')
dotenv.config();

const mysqlOptionProd: typeof MysqlConnectionOptions = {
    type: 'mysql',
    entities: ['./dist/**/**/*.entity.{ts,js}'],
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

module.exports = new DataSource(mysqlOptionProd);
