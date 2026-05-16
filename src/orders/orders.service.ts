import { BadRequestException, Injectable, NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Medicine } from '../medicines/medicine.entity';
import { OrderDto } from './dto/order.dto';


@Injectable()
export class OrdersService {

constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
  ) {}

  async create(orderDto: OrderDto) {
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    const order = this.orderRepository.create({
      userId: orderDto.userId,
      totalAmount: 0,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    for (const item of orderDto.items) {
      const medicine = await this.medicineRepository.findOne({
        where: { id: item.medicineId },
      });

      if (!medicine) {
        throw new NotFoundException(
          `Medicine with ID ${item.medicineId} not found`,
        );
      }

      if (medicine.stock < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for ${medicine.name}`,
        );
      }

      const subtotal = medicine.price * item.quantity;
      totalAmount += subtotal;

      medicine.stock -= item.quantity;
      await this.medicineRepository.save(medicine);

      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        medicineId: medicine.id,
        medicineName: medicine.name,
        quantity: item.quantity,
        price: medicine.price,
        subtotal,
      });

      orderItems.push(await this.orderItemRepository.save(orderItem));
    }

    savedOrder.totalAmount = totalAmount;
    await this.orderRepository.save(savedOrder);

    return {
      message: 'Order created successfully',
      order: savedOrder,
      items: orderItems,
    };
  }

  async findAll() {
    const orders = await this.orderRepository.find();

    return orders;
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const items = await this.orderItemRepository.find({
      where: { orderId: id },
    });

    return {
      order,
      items,
    };
  }

  async updateStatus(id: number, status: OrderStatus) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;

    return this.orderRepository.save(order);
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.orderItemRepository.delete({ orderId: id });
    await this.orderRepository.delete(id);

    return {
      message: 'Order deleted successfully',
    };
  }

}
