import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Medicine } from './medicine.entity';
import { MedicineDto } from './dto/medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Injectable()
export class MedicinesService {
constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
  ) {}

  async create(medicineDto: MedicineDto): Promise<Medicine> {
    const medicine = this.medicineRepository.create(medicineDto);
    return this.medicineRepository.save(medicine);
  }

  async findAll(): Promise<Medicine[]> {
    return this.medicineRepository.find();
  }

  async findOne(id: number): Promise<Medicine> {
    const medicine = await this.medicineRepository.findOne({
      where: { id },
    });

    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    return medicine;
  }

  async update(
    id: number,
    updateMedicineDto: UpdateMedicineDto,
  ): Promise<Medicine> {
    const medicine = await this.findOne(id);

    Object.assign(medicine, updateMedicineDto);

    return this.medicineRepository.save(medicine);
  }

  async remove(id: number): Promise<{ message: string }> {
    const medicine = await this.findOne(id);

    await this.medicineRepository.remove(medicine);

    return {
      message: 'Medicine deleted successfully',
    };
  }

}
