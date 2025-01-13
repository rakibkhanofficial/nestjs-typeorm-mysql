// src/product/product.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../_entities/products.entity';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
import { SubCategoryModule } from '../subcategory/subcategory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => AuthModule),
    CategoryModule,
    SubCategoryModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
