import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './src/schema/schema.ts',
  out: './migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME,
  },
});
