import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import Stripe from 'stripe';

import { UserService } from '../user/user.service';
import { CreateOrderDto } from '../product-order/dto/create-product-order.dto';
import { Order } from '../../_entities/tblorder.entity';
import { OrderItem } from '../../_entities/tblorderItems.entity';
import { Product } from '../../_entities/products.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly userService: UserService,
    private dataSource: DataSource,
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

  async confirmPayment(
    orderId: number,
    paymentIntentId: string,
  ): Promise<Order> {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        const order = await this.orderRepository.findOne({
          where: { id: orderId },
        });

        if (!order) {
          throw new NotFoundException('Order not found');
        }

        order.paymentStatus = 'Paid';
        order.stripePaymentIntentId = paymentIntentId;

        return this.orderRepository.save(order);
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

  async createOrderAfterPayment(
    createOrderDto: CreateOrderDto,
    userId: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Create the main order
      const order = this.orderRepository.create({
        userId,
        // user,
        buyerName: createOrderDto.buyerName,
        buyerPhone: createOrderDto.buyerPhone,
        deliveryStatus: createOrderDto.deliveryStatus,
        expectedDeliveryDate: createOrderDto.expectedDeliveryDate,
        expectedDeliveryTime: createOrderDto.expectedDeliveryTime,
        deliveryLocationAddress: createOrderDto.deliveryLocationAddress,
        deliveryLocationMapLink: createOrderDto.deliveryLocationMapLink,
        totalOrderPrice: createOrderDto.totalOrderPrice,
        orderStatus: 'Pending',
        paymentMethod: 'online',
        paymentStatus: 'Paid',
        stripePaymentIntentId: createOrderDto.stripePaymentIntentId,
      });

      const savedOrder = await queryRunner.manager.save(Order, order);

      // Create order items
      const orderItems = await Promise.all(
        createOrderDto.products.map(async (item) => {
          const product = await this.productRepository.findOne({
            where: { id: item.productId },
          });
          if (!product) {
            throw new NotFoundException(
              `Product with ID ${item.productId} not found`,
            );
          }

          const orderItem = this.orderItemRepository.create({
            order: savedOrder,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
            productImage: product.prodimage,
          });

          return queryRunner.manager.save(OrderItem, orderItem);
        }),
      );

      await queryRunner.commitTransaction();

      return {
        statusCode: 201,
        message: 'Order Created Succesfully',
        order: savedOrder,
        orderItems,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error in createOrderAfterPayment:', error);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'An error occurred while creating the order',
        );
      }
    } finally {
      await queryRunner.release();
    }
  }
}
