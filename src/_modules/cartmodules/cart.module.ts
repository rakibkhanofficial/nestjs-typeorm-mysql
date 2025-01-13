import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { AuthModule } from '../auth/auth.module';
import { Product } from '../../_entities/products.entity';
import { Cart } from '../../_entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product]), AuthModule],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
