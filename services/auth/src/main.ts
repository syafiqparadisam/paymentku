import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import {WINSTON_MODULE_NEST_PROVIDER} from "nest-winston"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });
  app.use(cookieParser());
  const urlCors = process.env.FRONTEND;
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  app.enableCors({
    origin: [urlCors],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  });

  app.listen(8800);
}
bootstrap();
