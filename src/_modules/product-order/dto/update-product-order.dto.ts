import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
  IsPositive,
  IsIn,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './orderItem.dto';

export class UpdateOrderDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderItemDto)
  products: OrderItemDto[];

  @IsNotEmpty()
  @IsString()
  buyerName: string;

  @IsNotEmpty()
  @IsString()
  buyerPhone: string;

  @IsNotEmpty()
  @IsString()
  deliveryStatus: string;

  @IsNotEmpty()
  @IsDate()
  expectedDeliveryDate: Date;

  @IsNotEmpty()
  @IsString()
  expectedDeliveryTime: string;

  @IsNotEmpty()
  @IsString()
  deliveryLocationAddress: string;

  @IsOptional()
  @IsString()
  deliveryLocationMapLink?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  totalOrderPrice: number;

  @IsNotEmpty()
  @IsString()
  @IsIn([
    'Pending',
    'Accepted',
    'Assigned',
    'On-the-Way',
    'Completed',
    'Rejected',
  ])
  orderStatus: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['cash', 'online'])
  paymentMethod: string;

  @IsOptional()
  @IsString()
  @IsIn(['unpaid', 'paid'])
  paymentStatus?: string;

  @IsOptional()
  @IsString()
  stripePaymentIntentId?: string;
}
