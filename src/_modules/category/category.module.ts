import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from '../../_entities/category.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), forwardRef(() => AuthModule)],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [TypeOrmModule], // You can keep this if you need to use CategoryService elsewhere
})
export class CategoryModule {}
