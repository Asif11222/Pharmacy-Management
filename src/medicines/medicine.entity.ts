import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';
@Entity('medicines')
export class Medicine {

    @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column('decimal')
  price: number;

  @Column()
  stock: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  expiryDate: string;

  @CreateDateColumn()
  createdAt: Date;

}