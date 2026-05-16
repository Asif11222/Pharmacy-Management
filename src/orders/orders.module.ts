import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Medicine } from '../medicines/medicine.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Order, OrderItem, Medicine])],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
