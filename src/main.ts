// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

let app: NestExpressApplication;

async function bootstrap(): Promise<NestExpressApplication> {
  if (!app) {
    try {
      Logger.log('Starting application...');
      app = await NestFactory.create<NestExpressApplication>(AppModule);
      Logger.log('Application created successfully');
      app.useStaticAssets(join(__dirname, '..', 'public'));
      app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      });
      await app.init();
      Logger.log('Application initialized');
    } catch (error) {
      if (error instanceof Error) {
        Logger.error('Error starting the application', error.stack);
      } else {
        Logger.error(
          'An unknown error occurred while starting the application',
        );
      }
      throw error;
    }
  }
  return app;
}

if (process.env.NODE_ENV !== 'production') {
  // For local development
  bootstrap().then(async (app) => {
    await app.listen(process.env.PORT || 3000);
    Logger.log(`Application is running on: ${await app.getUrl()}`);
  });
}
