import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { CarBooking } from '../../_entities/car_booking.entity';
import { Car } from '../../_entities/car.entity';
import { CreateCarBookingDto } from '../carbookingModule/car_booking.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(CarBooking)
    private readonly carBookingRepository: Repository<CarBooking>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    private readonly userService: UserService,
  ) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY is not set in the environment');
      throw new InternalServerErrorException('Stripe configuration error');
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
  ): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount,
      currency,
    });
  }

  async createBookingAfterPayment(
    createCarBookingDto: CreateCarBookingDto,
    userId: number,
  ): Promise<CarBooking> {
    try {
      const car = await this.carRepository.findOne({
        where: { id: createCarBookingDto.carId },
      });
      if (!car) {
        throw new NotFoundException('Car not found');
      }

      const user = await this.userService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const booking = this.carBookingRepository.create({
        ...createCarBookingDto,
        userId,
        carModel: car.model,
        carName: car.name,
        carImage: car.image,
        renterName: user.name,
        renterPhone: user.phone,
        rideStatus: 'Pending',
        paymentMethod: 'online',
        paymentStatus: 'Paid',
      });

      return await this.carBookingRepository.save(booking);
    } catch (error) {
      console.error('Error in createBookingAfterPayment:', error);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'An error occurred while creating the booking',
        );
      }
    }
  }

  async confirmPayment(
    bookingId: number,
    paymentIntentId: string,
  ): Promise<CarBooking> {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        const booking = await this.carBookingRepository.findOne({
          where: { id: bookingId },
        });

        if (!booking) {
          throw new NotFoundException('Booking not found');
        }

        booking.paymentStatus = 'Paid';
        booking.stripePaymentIntentId = paymentIntentId;

        return this.carBookingRepository.save(booking);
      } else {
        throw new Error('Payment not successful');
      }
    } catch (error) {
      console.error('Error in confirmPayment:', error);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'An error occurred while confirming the payment',
        );
      }
    }
  }
}
