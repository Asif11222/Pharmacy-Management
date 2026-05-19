import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users/users.service';
import { UserRole } from './users/user.entity';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private async getAvailablePhone(preferredPhone: string) {
    const existingPhone = await this.usersService.findByPhone(preferredPhone);

    if (!existingPhone) {
      return preferredPhone;
    }

    let suffix = 1;
    let candidatePhone = `${preferredPhone}${suffix}`;

    while (await this.usersService.findByPhone(candidatePhone)) {
      suffix += 1;
      candidatePhone = `${preferredPhone}${suffix}`;
    }

    return candidatePhone;
  }

  async onModuleInit() {
    const adminEmail = this.normalizeEmail(
      process.env.ADMIN_EMAIL || 'admin@pharmacy.com',
    );
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin1234!';
    const adminPhone = await this.getAvailablePhone(
      process.env.ADMIN_PHONE || '00000000000',
    );

    const existingAdmin = await this.usersService.findByEmail(adminEmail);
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (!existingAdmin) {
      await this.usersService.create({
        fullName: 'Default Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: adminPhone,
        role: UserRole.ADMIN,
      });
      return;
    }

    existingAdmin.fullName = 'Default Admin';
    existingAdmin.email = adminEmail;
    existingAdmin.password = hashedPassword;
    existingAdmin.phone = adminPhone;
    existingAdmin.role = UserRole.ADMIN;

    await this.usersService.save(existingAdmin);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
