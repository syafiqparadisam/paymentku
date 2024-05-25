import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });
  app.use(cookieParser());
  const urlCors = process.env.FRONTEND;
  app.enableCors({
    origin: ['https://d070-114-79-21-145.ngrok-free.app', urlCors],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  });
  app.listen(8800);
}
bootstrap();
