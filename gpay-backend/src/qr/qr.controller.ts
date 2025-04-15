import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { QrService } from './qr.service';

@Controller('qr')
@UseGuards(JwtAuthGuard)
export class QrController {
  constructor(private readonly qrService: QrService) {}

  // @Get('generate/fixed')
  // async generateFixedQr(@Request() req) {
  //   const userId = req.user.userId;
  //   const qrCode = await this.qrService.generateFixedQr(userId);
  //   return { qrType: 'FIXED', image: qrCode };
  // }

  @Get('generate/fixed-amount')
  async generateFixedAmountQr(@Query('amount') amount: number) {
    const qrCode = await this.qrService.generateFixedAmountQr(amount);
    return { qrType: 'FIXED_AMOUNT', image: qrCode };
  }

  // ✅ New dynamic QR endpoint
  @Post('generate/dynamic')
  async generateDynamicQr(@Request() req, @Body() body: { receiverPhone: string; amount: number }) {
    const senderId = req.user.userId;
    const { receiverPhone, amount } = body;
    const qrCode = await this.qrService.generateDynamicQr(senderId, receiverPhone, amount);
    return {
      qrType: 'DYNAMIC',
      qrCode: `data:image/png;base64,${qrCode}`,
      message: 'QR generated successfully'
    };
  }
}
