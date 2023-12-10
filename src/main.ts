import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('localhost.key'),
    cert: fs.readFileSync('localhost.crt'),
  };
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: 'https://localhost:3000',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(configService.get('PORT'));
}
bootstrap();
