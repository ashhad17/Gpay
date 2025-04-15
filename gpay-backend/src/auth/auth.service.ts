// src/auth/auth.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { EmsService } from '../ems/ems.service';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from './register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Otp } from './otp.entity';
import { Wallet } from 'src/wallet/wallet.entity';
import { IsPhoneNumber } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Otp) private otpRepo: Repository<Otp>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>, // Correctly injecting the repository
    private jwtService: JwtService,
    private configService: ConfigService,
    private emsService: EmsService, // Correctly injecting the EmsService
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, phone } = registerDto;

    // Check if user already exists (by email or phone)
    const existingUser = await this.userRepo.findOne({ 
      where: [{ email }, { phone }] 
    });

    if (existingUser) {
      throw new Error('User with this email or phone already exists');
    }

    // Generate OTP
    const otp = this.generateOtp();

    // Create new user object without password
    const newUser = this.userRepo.create({
      name,
      email,
      phone,
      otp, // Save OTP temporarily for verification
    });

    // Save the new user to the database
    await this.userRepo.save(newUser);

    // Send OTP to email (or phone via SMS if needed)
    this.emsService.sendOtpEmail(email, otp); // Correct usage of emsService

    return {
      message: 'User registered successfully, OTP sent to email',
      user: { name: newUser.name, email: newUser.email, phone: newUser.phone },
    };
  }

  async sendOtp(email: string): Promise<string> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = this.generateOtp();
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 5);  // OTP expires in 5 minutes

    user.otp = otp;
    user.otpExpiration = otpExpiration;

    await this.userRepo.save(user);

    // Send OTP email
    await this.emsService.sendOtpEmail(user.email, otp);

    return 'OTP sent to your email';
  }

  async verifyOtp(email: string, otp: string):  Promise<{ token: string }> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    const now = new Date();
    if (user.otpExpiration != null && now > user.otpExpiration) {
      throw new BadRequestException('OTP expired');
    }

    // OTP valid, mark user as verified
    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiration = null;
    await this.userRepo.save(user);
    const walletExists = await this.walletRepo.findOne({ where: { user: { id: user.id } } });

if (!walletExists) {
  const wallet = this.walletRepo.create({ user, balance: 0 });
  await this.walletRepo.save(wallet);
}
    const payload = { sub: user.id, email: user.email ,phone:user.phone};
    const token = this.jwtService.sign(payload);

    return { token };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();  // 6-digit OTP
  }
}
