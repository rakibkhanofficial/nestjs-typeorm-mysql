// src/carmodule/car.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from '../../_entities/car.entity';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
import { SubCategoryModule } from '../subcategory/subcategory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car]),
    forwardRef(() => AuthModule),
    CategoryModule,
    SubCategoryModule,
  ],
  providers: [CarService],
  controllers: [CarController],
  exports: [CarService],
})
export class CarModule {}
