import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')  // Ensure this route exists
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Post('send-otp')
  sendOtp(@Body('email') phone: string) {
    return this.authService.sendOtp(phone);
  }

  @Post('verify-otp')
  verifyOtp(@Body('email') phone: string, @Body('code') code: string) {
    return this.authService.verifyOtp(phone, code);
  }
}
