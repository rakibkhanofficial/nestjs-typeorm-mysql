import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from '../_modules/user/user.module';
import { typeOrmConfig } from '../config/database.config';
// import configService from '../config/database.config';
import { ProductModule } from '../_modules/products/products.module';
import { AuthModule } from '../_modules/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlobController } from '../_modules/blobmodule/blob.controller';
import { BlobService } from '../_modules/blobmodule/blob.service';
import { Image } from '../_entities/image.entity';
import { CategoryModule } from '../_modules/category/category.module';
import { SubCategoryModule } from '../_modules/subcategory/subcategory.module';
import { CartModule } from '../_modules/cartmodules/cart.module';
import { ProductOrderModule } from '../_modules/product-order/product-order.module';
import { PaymentModule } from '../_modules/paymentmodule/product-order-payemnt.module';
import { CardModule } from '../_modules/cardmodule/card.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigModule globally available
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Image]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Path to the public directory
      serveRoot: '/', // The base route for serving static files
      exclude: ['/api*', '/auth', 'products'],
    }),
    AuthModule,
    UserModule,
    ProductModule,
    CategoryModule,
    SubCategoryModule,
    CartModule,
    ProductOrderModule,
    PaymentModule,
    CardModule,
  ],
  controllers: [AppController, BlobController],
  providers: [JwtService, AppService, BlobService],
})
export class AppModule {}
