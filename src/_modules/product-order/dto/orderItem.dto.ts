import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  orderId: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}
