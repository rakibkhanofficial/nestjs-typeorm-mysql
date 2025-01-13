import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import * as path from 'path';

function listFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fileList = listFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

let app: NestExpressApplication;

async function bootstrap(): Promise<NestExpressApplication> {
  if (!app) {
    try {
      Logger.log('Starting application...');
      Logger.log(
        `Files in current directory:\n${listFiles(process.cwd()).join('\n')}`,
      );
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
} else {
  // For Vercel (production)
  module.exports = async (req: Request, res: Response): Promise<void> => {
    if (!app) {
      app = await bootstrap();
    }
    app.getHttpAdapter().getInstance()(req, res);
  };
}
