// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async create(userData: Partial<Users>): Promise<Users> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<Users | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findByPhone(phone: string): Promise<Users | null> {
    return this.userRepository.findOne({
      where: { phone },
    });
  }

  async findById(id: number): Promise<Users | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<Users[]> {
    return this.userRepository.find();
  }

   async save(user: Users): Promise<Users> {
  return this.userRepository.save(user);
 }

 async findByResetToken(token: string): Promise<Users | null> {
  return this.userRepository.findOne({
    where: { resetPasswordToken: token },
  });
}

}