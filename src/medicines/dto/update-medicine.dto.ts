// src/medicines/dto/update-medicine.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { MedicineDto } from './medicine.dto';

export class UpdateMedicineDto extends PartialType(MedicineDto) {}