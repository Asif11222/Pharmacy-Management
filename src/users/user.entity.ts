// src/users/user.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ nullable: true })
  phone!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'text', nullable: true })
  resetPasswordToken!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires!: Date | null;
}