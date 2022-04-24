import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const HOSTNAME = process.env.HOSTNAME || 'localhost'
const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  await app.listen(PORT);

  Logger.log(
    `🚀 Application is running on ${HOSTNAME}:${PORT}`,
    'Bootstrap',
  );
}
bootstrap();
