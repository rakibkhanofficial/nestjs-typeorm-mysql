import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { Product } from '../../_entities/products.entity';
import { Order } from '../../_entities/tblorder.entity';
import { PaymentController } from './product-order-payement.controller';
import { PaymentService } from './product-order-payment.service';
import { OrderItem } from '../../_entities/tblorderItems.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    forwardRef(() => AuthModule),
    UserModule,
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
