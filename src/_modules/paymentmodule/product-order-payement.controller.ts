import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TokenValidationGuard } from '../../guards/token-validation.guard';
import { RolesGuard } from '../auth/jwt/roles.guard';
import { Roles } from '../auth/jwt/roles.decorator';
import { PaymentService } from './product-order-payment.service';
import { CreateOrderDto } from '../product-order/dto/create-product-order.dto';

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

  @Post('confirm-payment')
  @Roles('Customer', 'Admin', 'SuperAdmin')
  async confirmPayment(
    @Body() body: { orderId: number; paymentIntentId: string },
  ) {
    try {
      if (!body.orderId || !body.paymentIntentId) {
        throw new HttpException(
          'Missing required fields: orderId or paymentIntentId',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.paymentService.confirmPayment(
        body.orderId,
        body.paymentIntentId,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Payment confirmed and order updated',
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

  @Post('create-order-after-payment')
  @Roles('Customer', 'Admin', 'SuperAdmin')
  async createOrderAfterPayment(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: RequestWithUser,
  ) {
    try {
      const order = await this.paymentService.createOrderAfterPayment(
        createOrderDto,
        req.user.userId,
      );

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Order created successfully after payment',
        data: order,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while creating the order',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
