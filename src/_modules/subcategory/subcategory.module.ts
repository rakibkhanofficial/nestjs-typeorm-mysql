import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryController } from './subcategory.controller';
import { SubCategoryService } from './subcategory.service';
import { SubCategory } from '../../_entities/subcategory.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubCategory]),
    forwardRef(() => AuthModule),
  ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
  exports: [TypeOrmModule], // You can keep this if you need to use SubCategoryService elsewhere
})
export class SubCategoryModule {}
