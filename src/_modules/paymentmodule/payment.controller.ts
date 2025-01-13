import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TokenValidationGuard } from '../../guards/token-validation.guard';
import { RolesGuard } from '../auth/jwt/roles.guard';
import { Roles } from '../auth/jwt/roles.decorator';
import { CreateCarBookingDto } from '../carbookingModule/car_booking.dto';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
  };
}

@Controller('payments')
@UseGuards(TokenValidationGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-intent')
  @Roles('Customer', 'Admin', 'SuperAdmin')
  async createPaymentIntent(
    @Body() { amount }: { amount: number },
    @Req() req: RequestWithUser,
  ) {
    try {
      const paymentIntent = await this.paymentService.createPaymentIntent(
        amount,
        'usd',
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Payment intent created successfully',
        data: { clientSecret: paymentIntent.client_secret },
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while creating the payment intent',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create-booking-after-payment')
  @Roles('Customer', 'Admin', 'SuperAdmin')
  async createBookingAfterPayment(
    @Body() createCarBookingDto: CreateCarBookingDto,
    @Req() req: RequestWithUser,
  ) {
    try {
      const booking = await this.paymentService.createBookingAfterPayment(
        createCarBookingDto,
        req.user.userId,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Booking created successfully after payment',
        data: booking,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while creating the booking',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('confirm-payment')
  @Roles('Customer', 'Admin', 'SuperAdmin')
  async confirmPayment(
    @Body() body: { bookingId: number; paymentIntentId: string },
  ) {
    try {
      if (!body.bookingId || !body.paymentIntentId) {
        throw new HttpException(
          'Missing required fields: bookingId or paymentIntentId',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.paymentService.confirmPayment(
        body.bookingId,
        body.paymentIntentId,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Payment confirmed and booking updated',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while confirming the payment',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
