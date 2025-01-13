import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarBookingController } from './car_booking.controller';
import { CarBookingService } from './car_booking.service';
import { CarBooking } from '../../_entities/car_booking.entity';
import { UserModule } from '../user/user.module';
import { CarModule } from '../carmodule/car.module';
import { AuthModule } from '../auth/auth.module';
import { PaymentModule } from '../paymentmodule/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarBooking]),
    forwardRef(() => AuthModule),
    CarModule,
    UserModule,
    PaymentModule,
  ],
  controllers: [CarBookingController],
  providers: [CarBookingService],
  exports: [CarBookingService],
})
export class CarBookingModule {}
