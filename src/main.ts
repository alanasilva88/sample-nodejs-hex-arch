import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filter/all-exceptions.filter';
import { logger } from './common/logger/winston-logger';
import { AppModule } from './app.module';
import basicAuth from 'express-basic-auth';

// Load environment variables
dotenv.config();

async function bootstrap() {
  try {
    const PORT = process.env.PORT || 8080;
    const app = await NestFactory.create(AppModule, {
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });

    console.log('process.env.CORS_ORIGIN: ' + process.env.CORS_ORIGIN);

    app.enableCors({
      origin: [process.env.CORS_ORIGIN],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    });

    // Only enable Swagger if not in production
    if (process.env.NODE_ENV !== 'production') {
      // Protect Swagger with Basic Auth
      app.use(
        ['/api-docs'],
        basicAuth({
          users: { admin: 'win' },
          challenge: true,
        }),
      );

      const config = new DocumentBuilder()
        .setTitle('Fullstackfy API Documentation')
        .setDescription('API documentation for the fullstackfy api')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api-docs', app, document);
    }

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter(logger));

    await app.listen(PORT);
    console.log(`Application is running on: http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to start the application', error);
  }
}

bootstrap();
