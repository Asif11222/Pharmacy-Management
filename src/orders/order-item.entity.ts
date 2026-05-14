import{
    Entity,
    PrimaryGeneratedColumn,
    Column,
}from 'typeorm';
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  medicineId: number;

  @Column()
  medicineName: string;

  @Column('int')
  quantity: number;

  @Column('float')
  price: number;

  @Column('float')
  subtotal: number;
}