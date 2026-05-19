import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{11}$/, {
    message: 'Phone number must be exactly 11 digits',
  })
  phone!: string;
}