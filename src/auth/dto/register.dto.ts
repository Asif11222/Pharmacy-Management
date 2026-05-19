// src/auth/dto/register.dto.ts

import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(4)
  password!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/, {
    message: 'Phone number must contain numbers only',
  })
  phone!: string;
}