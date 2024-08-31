import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './src/schemas/schema.ts',
  out: './db',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME,
  },
});
