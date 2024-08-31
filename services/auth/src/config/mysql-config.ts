import { DrizzleMySqlConfig } from '@knaadh/nestjs-drizzle-mysql2/src/mysql.interface';
import * as schema from '../schema/schema';

export const mysqlConfig: DrizzleMySqlConfig = {
  mysql: {
    connection: 'pool',
    config: {
      connectionLimit: 40,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWD,
    },
  },
  config: { schema: { ...schema }, mode: 'default' },
};
