import {  Body, 
    Controller,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post, 

} from '@nestjs/common';

@Controller('payments')
export class PaymentsController {

    constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() paymentDto: PaymentDto) {
    return this.paymentsService.create(paymentDto);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: PaymentStatus,
  ) {
    return this.paymentsService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.remove(id);
  }

}
