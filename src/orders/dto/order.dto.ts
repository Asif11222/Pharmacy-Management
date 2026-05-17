
// src/orders/dto/order.dto.ts

import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  medicineId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class OrderDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}