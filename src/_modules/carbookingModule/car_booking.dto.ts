import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  IsDate,
  IsPositive,
  IsIn,
} from 'class-validator';

export class CreateCarBookingDto {
  @IsNotEmpty()
  @IsNumber()
  carId: number;

  @IsNotEmpty()
  @IsString()
  tripType: string;

  @IsOptional()
  @IsString()
  airportName?: string;

  @IsOptional()
  @IsString()
  flightNo?: string;

  @IsOptional()
  @IsBoolean()
  childSeat?: boolean;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  luggage: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  passenger: number;

  @IsNotEmpty()
  @IsString()
  mobileNumber: string;

  @IsNotEmpty()
  @IsString()
  rideStatus: string;

  @IsNotEmpty()
  @IsString()
  pickupLocationAddress: string;

  @IsNotEmpty()
  @IsNumber()
  totalBookingPrice: number;

  @IsOptional()
  @IsString()
  pickupLocationMapLink?: string;

  @IsNotEmpty()
  @IsDate()
  pickupDate: Date;

  @IsNotEmpty()
  @IsString()
  pickupTime: string;

  @IsNotEmpty()
  @IsString()
  dropoffLocationAddress: string;

  @IsOptional()
  @IsString()
  dropoffLocationMapLink?: string;

  @IsOptional()
  @IsNumber()
  hour?: number;

  @IsOptional()
  @IsNumber()
  distance?: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['cash', 'online'])
  paymentMethod: string;

  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @IsOptional()
  @IsString()
  stripePaymentIntentId?: string;
}

export class UpdateCarBookingDto extends CreateCarBookingDto {
  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['cash', 'online'])
  paymentMethod: string;

  @IsOptional()
  @IsString()
  paymentId?: string;

  @IsOptional()
  @IsString()
  stripePaymentIntentId?: string;
}
