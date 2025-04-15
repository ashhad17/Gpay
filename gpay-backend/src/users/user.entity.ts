// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;  // for SMS OTP

  @Column()
  name: string;

  @Column({ default: false })
  isEmailVerified: boolean;  // to check if the email has been verified

  @Column('varchar', { nullable: true, length: 255 })
  otp: string | null;  // for storing OTP temporarily

  @Column('varchar', { nullable: true, length: 255 })
  otpExpiration: Date | null;  // expiration time for OTP
}
