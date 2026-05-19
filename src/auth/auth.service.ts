// src/auth/auth.service.ts

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import * as crypto from 'crypto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private normalizePhone(phone: string) {
    return phone.trim();
  }

  async register(registerDto: RegisterDto) {
    const email = this.normalizeEmail(registerDto.email);
    const phone = this.normalizePhone(registerDto.phone);
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const existingPhone = await this.usersService.findByPhone(phone);

    if (existingPhone) {
      throw new BadRequestException('Phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      fullName: registerDto.fullName,
      email,
      password: hashedPassword,
      phone,
    });

    const { password, ...result } = user;

    return {
      message: 'User registered successfully',
      user: result,
    };
  }

  async login(loginDto: LoginDto) {
    const email = this.normalizeEmail(loginDto.email);
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      accessToken: token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const email = this.normalizeEmail(forgotPasswordDto.email);
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Wrong email or number');
    }

    if (!user.phone || user.phone !== forgotPasswordDto.phone) {
      throw new BadRequestException('Wrong email or number');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await this.usersService.save(user);
    await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      message: 'Password reset email sent successfully',
      resetToken,
    };
  }


async resetPassword(resetPasswordDto: ResetPasswordDto) {
  const user = await this.usersService.findByResetToken(
    resetPasswordDto.token,
  );

  if (!user) {
    throw new BadRequestException('Invalid reset token');
  }

  if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
    throw new BadRequestException('Reset token has expired');
  }

  const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await this.usersService.save(user);

  return {
    message: 'Password reset successfully',
  };
}


async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
  const user = await this.usersService.findById(userId);

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  const isPasswordMatched = await bcrypt.compare(
    changePasswordDto.oldPassword,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new BadRequestException('Old password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(
    changePasswordDto.newPassword,
    10,
  );

  user.password = hashedPassword;

  await this.usersService.save(user);

  return {
    message: 'Password changed successfully',
  };
}



}