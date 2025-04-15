import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './otp.entity';
import { User } from '../users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Wallet } from 'src/wallet/wallet.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { EmsModule } from 'src/ems/ems.module';  // Ensure this module is imported
import { UsersService } from 'src/users/users.service';
import { EmsService } from 'src/ems/ems.service';  // Ensure the service is imported

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp, User, Wallet]),  // Only include entities here
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') },
      }),
    }),
    EmsModule,  // Ensure the EmsModule is imported, which provides EmsService
  ],
  providers: [AuthService, JwtStrategy, EmsService],  // EmsService added to providers
  controllers: [AuthController],
})
export class AuthModule {}
