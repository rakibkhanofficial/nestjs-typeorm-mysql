import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserService } from '../user/user.service';
import { ProductService } from '../products/products.service';
import { Order } from '../../_entities/tblorder.entity';
import { OrderItem } from '../../_entities/tblorderItems.entity';
import { CreateOrderDto } from './dto/create-product-order.dto';
import { UpdateOrderDto } from './dto/update-product-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private userService: UserService,
    private productService: ProductService,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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
        orderStatus: createOrderDto.orderStatus,
        paymentMethod: createOrderDto.paymentMethod,
        paymentStatus: createOrderDto.paymentStatus,
        stripePaymentIntentId: createOrderDto.stripePaymentIntentId,
      });

      const savedOrder = await queryRunner.manager.save(Order, order);

      const orderItems = await Promise.all(
        createOrderDto.products.map(async (item) => {
          const productEntity = await this.productService.findById(
            item.productId,
          );
          if (!productEntity) {
            throw new NotFoundException(
              `Product with ID ${item.productId} not found`,
            );
          }

          const orderItem = this.orderItemRepository.create({
            // order: savedOrder,
            orderId: savedOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: productEntity.price,
            productImage: productEntity.prodimage,
          });

          return queryRunner.manager.save(OrderItem, orderItem);
        }),
      );

      await queryRunner.commitTransaction();

      return {
        statusCode: 201,
        message: 'Order Placed Successfully',
        order: savedOrder,
        orderItems,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByUser(userId: number, page: number, limit: number) {
    const [orders, total] = await this.orderRepository.findAndCount({
      where: { userId },
      // relations: ['orderItems', 'orderItems.product'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: orders,
      total,
      page,
      limit,
    };
  }

  async findAllPendingOrders(page: number, limit: number) {
    const [orders, total] = await this.orderRepository.findAndCount({
      where: { orderStatus: 'Pending' },
      relations: ['orderItems', 'orderItems.product'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: orders,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number, userId: number, userRole: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'orderItems', 'orderItems.product', 'deliveryman'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (userRole === 'Customer' && order.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this order',
      );
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto, userRole: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!['Admin', 'SuperAdmin'].includes(userRole)) {
      throw new ForbiddenException(
        'You do not have permission to update this order',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update order details
      Object.assign(order, updateOrderDto);
      await queryRunner.manager.save(Order, order);

      // Update order items if provided
      if (updateOrderDto.products) {
        // Remove existing order items
        await queryRunner.manager.remove(OrderItem, order.orderItems);

        // Create new order items
        const newOrderItems = await Promise.all(
          updateOrderDto.products.map(async (product) => {
            const productEntity = await this.productService.findById(
              product.productId,
            );
            if (!productEntity) {
              throw new NotFoundException(
                `Product with ID ${product.productId} not found`,
              );
            }

            const orderItem = this.orderItemRepository.create({
              orderId: order.id,
              productId: product.productId,
              quantity: product.quantity,
              price: productEntity.price,
              productImage: productEntity.prodimage,
            });

            return queryRunner.manager.save(OrderItem, orderItem);
          }),
        );

        order.orderItems = newOrderItems;
      }

      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateStatus(id: number, status: string, userRole: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!['Admin', 'SuperAdmin'].includes(userRole)) {
      throw new ForbiddenException(
        'You do not have permission to update this order status',
      );
    }

    order.orderStatus = status;
    return this.orderRepository.save(order);
  }

  async remove(id: number, userRole: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!['Admin', 'SuperAdmin'].includes(userRole)) {
      throw new ForbiddenException(
        'You do not have permission to delete this order',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Remove order items
      await queryRunner.manager.remove(OrderItem, order.orderItems);

      // Remove order
      await queryRunner.manager.remove(Order, order);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllForAdmin(page: number, limit: number) {
    const [orders, total] = await this.orderRepository.findAndCount({
      relations: ['user', 'orderItems', 'orderItems.product', 'deliveryman'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: orders,
      total,
      page,
      limit,
    };
  }
}
