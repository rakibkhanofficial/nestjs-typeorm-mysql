import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './product-order.service';
import { TokenValidationGuard } from '../../guards/token-validation.guard';
import { RolesGuard } from '../auth/jwt/roles.guard';
import { Roles } from '../auth/jwt/roles.decorator';
import { CreateOrderDto } from './dto/create-product-order.dto';
import { UpdateOrderDto } from './dto/update-product-order.dto';
@Controller('orders')
@UseGuards(TokenValidationGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/createproductorderbycash')
  @Roles('Customer')
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    try {
      return await this.orderService.create(createOrderDto, req.user.userId);
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

  @Get()
  @Roles('Customer')
  findAllByUser(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.orderService.findAllByUser(req.user.userId, page, limit);
  }

  @Get('pending')
  @Roles('Admin', 'SuperAdmin')
  findAllPendingOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.orderService.findAllPendingOrders(page, limit);
  }

  @Get(':id')
  @Roles('Customer', 'Admin', 'SuperAdmin', 'Deliveryman')
  findOne(@Param('id') id: string, @Req() req) {
    return this.orderService.findOne(+id, req.user.userId, req.user.role);
  }

  @Patch(':id')
  @Roles('Admin', 'SuperAdmin')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req,
  ) {
    return this.orderService.update(+id, updateOrderDto, req.user.role);
  }

  @Patch(':id/status')
  @Roles('Admin', 'SuperAdmin')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req,
  ) {
    return this.orderService.updateStatus(+id, status, req.user.role);
  }

  @Delete(':id')
  @Roles('Admin', 'SuperAdmin')
  remove(@Param('id') id: string, @Req() req) {
    return this.orderService.remove(+id, req.user.role);
  }

  @Get('admin/all')
  @Roles('Admin', 'SuperAdmin')
  findAllForAdmin(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.orderService.findAllForAdmin(page, limit);
  }
}
