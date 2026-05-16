import { Body,Controller,Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post, } from '@nestjs/common';

  import { OrdersService } from './orders.service';
import { OrderDto } from './dto/order.dto';
import { OrderStatus } from './order.entity';

@Controller('orders')
export class OrdersController {

     constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() orderDto: OrderDto) {
    return this.ordersService.create(orderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
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
