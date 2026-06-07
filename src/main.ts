import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filter/all-exceptions.filter';
import { logger } from './common/logger/winston-logger';
import { AppModule } from './app.module';

// Load environment variables
dotenv.config();

async function bootstrap() {
  try {
    const PORT = process.env.PORT || 8080;
    const app = await NestFactory.create(AppModule, {
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });

    app.enableCors({
      origin: [process.env.CORS_ORIGIN],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    });

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter(logger));

    await app.listen(PORT);
    console.log(`Application is running on: http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to start the application', error);
  }
}

bootstrap();
