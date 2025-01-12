// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @IsEmail()
  email: string;
}
