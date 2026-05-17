import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment, PaymentStatus } from './payment.entity';
import { PaymentDto } from './dto/payment.dto';
import { Order } from '../orders/order.entity';

@Injectable()
export class PaymentsService {
     constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(paymentDto: PaymentDto) {
    const order = await this.orderRepository.findOne({
      where: { id: paymentDto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (paymentDto.amount !== order.totalAmount) {
      throw new BadRequestException('Payment amount does not match order total');
    }

    const payment = this.paymentRepository.create({
      orderId: paymentDto.orderId,
      amount: paymentDto.amount,
      method: paymentDto.method,
      status: paymentDto.status || PaymentStatus.PENDING,
      transactionId: paymentDto.transactionId,
    });

    return this.paymentRepository.save(payment);
  }

  async findAll() {
    return this.paymentRepository.find();
  }

  async findOne(id: number) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async updateStatus(id: number, status: PaymentStatus) {
    const payment = await this.findOne(id);

    payment.status = status;

    return this.paymentRepository.save(payment);
  }

  async remove(id: number) {
    const payment = await this.findOne(id);

    await this.paymentRepository.remove(payment);

    return {
      message: 'Payment deleted successfully',
    };
  }


}
