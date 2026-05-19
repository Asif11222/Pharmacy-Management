import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment, PaymentMethod, PaymentStatus } from './payment.entity';
import { PaymentDto } from './dto/payment.dto';
import { Order, OrderStatus } from '../orders/order.entity';
import { UserRole } from '../users/user.entity';

@Injectable()
export class PaymentsService {
     constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(paymentDto: PaymentDto, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: paymentDto.orderId },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    const existingPayment = await this.paymentRepository.findOne({
      where: { orderId: paymentDto.orderId },
    });

    if (existingPayment) {
      throw new BadRequestException('Payment already exists for this order');
    }

    if (paymentDto.amount !== order.totalAmount) {
      throw new BadRequestException('Payment amount does not match order total');
    }

    const payment = this.paymentRepository.create({
      orderId: paymentDto.orderId,
      amount: paymentDto.amount,
      method: PaymentMethod.COD,
      status: PaymentStatus.PENDING,
    });

    try {
      return await this.paymentRepository.save(payment);
    } catch {
      throw new BadRequestException('Payment already exists for this order');
    }
  }

  async findAll(userId: number, role?: string) {
    if (role === UserRole.ADMIN) {
      return this.paymentRepository.find({
        order: { createdAt: 'DESC' },
      });
    }

    return this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoin(Order, 'order', 'order.id = payment.orderId')
      .where('order.userId = :userId', { userId })
      .orderBy('payment.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: number, userId: number, role?: string) {
    const payment =
      role === UserRole.ADMIN
        ? await this.paymentRepository.findOne({ where: { id } })
        : await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const order =
      role === UserRole.ADMIN
        ? await this.orderRepository.findOne({ where: { id: payment.orderId } })
        : await this.orderRepository.findOne({
            where: { id: payment.orderId, userId },
          });

    if (!order) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async updateStatus(id: number, status: PaymentStatus, userId: number, role?: string) {
    const payment = await this.findOne(id, userId, role);
    const order =
      role === UserRole.ADMIN
        ? await this.orderRepository.findOne({ where: { id: payment.orderId } })
        : await this.orderRepository.findOne({
            where: { id: payment.orderId, userId },
          });

    if (!order) {
      throw new NotFoundException('Payment not found');
    }

    payment.status = status;

    if (status === PaymentStatus.PAID) {
      order.status = OrderStatus.DELIVERED;
    } else if (status === PaymentStatus.CANCELLED) {
      order.status = OrderStatus.CANCELLED;
      payment.status = PaymentStatus.CANCELLED;
    } else if (status === PaymentStatus.FAILED) {
      order.status = OrderStatus.DELIVERY_FAILED;
      payment.status = PaymentStatus.CANCELLED;
    }

    await this.orderRepository.save(order);

    return this.paymentRepository.save(payment);
  }

  async remove(id: number, userId: number, role?: string) {
    const payment = await this.findOne(id, userId, role);

    await this.paymentRepository.remove(payment);

    return {
      message: 'Payment deleted successfully',
    };
  }


}
