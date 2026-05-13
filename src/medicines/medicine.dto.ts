// src/medicines/dto/medicine.dto.ts

import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class MedicineDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;
}