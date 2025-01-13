import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsNumber,
} from 'class-validator';

export class CreateCardDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @Length(16, 19)
  number: string;

  @IsString()
  @IsNotEmpty()
  holder: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  @Matches(/^(0[1-9]|1[0-2])$/)
  expiryMonth: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  @Matches(/^[0-9]{2}$/)
  expiryYear: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 4)
  @Matches(/^[0-9]{3,4}$/)
  cvv: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}

export class UpdateCardDto {
  @IsString()
  @IsNotEmpty()
  @Length(16, 19)
  number?: string;

  @IsString()
  @IsNotEmpty()
  holder?: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  @Matches(/^(0[1-9]|1[0-2])$/)
  expiryMonth?: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  @Matches(/^[0-9]{2}$/)
  expiryYear?: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 4)
  @Matches(/^[0-9]{3,4}$/)
  cvv?: string;

  @IsString()
  @IsNotEmpty()
  type?: string;
}
