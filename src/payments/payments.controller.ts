import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { PaymentDto } from './dto/payment.dto';
import { PaymentStatus } from './payment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {

    constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Req() req: any, @Body() paymentDto: PaymentDto) {
    return this.paymentsService.create(paymentDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.paymentsService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id/status')
  updateStatus(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: PaymentStatus,
  ) {
    return this.paymentsService.updateStatus(id, status, req.user.id, req.user.role);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.remove(id, req.user.id, req.user.role);
  }

}
