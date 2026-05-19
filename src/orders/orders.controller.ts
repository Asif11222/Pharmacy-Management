import { Body,Controller,Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post, } from '@nestjs/common';

import { Req, UseGuards } from '@nestjs/common';

  import { OrdersService } from './orders.service';
import { OrderDto } from './dto/order.dto';
import { OrderStatus } from './order.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {

     constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() req: any, @Body() orderDto: OrderDto) {
    return this.ordersService.create(orderDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.ordersService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }

}
