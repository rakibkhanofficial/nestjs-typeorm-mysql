import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { typeOrmConfig } from './config/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigModule globally available
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Path to the public directory
      serveRoot: '/', // The base route for serving static files
      exclude: ['/api*', '/auth', 'products'],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
