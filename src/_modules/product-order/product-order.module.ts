// src/product-order/product-order.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './product-order.service';
import { OrderController } from './product-order.controller';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../products/products.module';
import { Order } from '../../_entities/tblorder.entity';
import { PaymentModule } from '../paymentmodule/product-order-payemnt.module';
import { AuthModule } from '../auth/auth.module';
import { OrderItem } from '../../_entities/tblorderItems.entity';
import { Product } from '../../_entities/products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    forwardRef(() => AuthModule),
    UserModule,
    ProductModule,
    PaymentModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class ProductOrderModule {}
