import { Controller, Post, Body, Req, UseGuards, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SendMoneyDto } from './dto/send-money.dto';
import * as QRCode from 'qrcode';
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private txService: TransactionService) {}

  @Post('send')
  send(@Body() dto: SendMoneyDto, @Req() req) {
    return this.txService.sendMoney(req.user.userId, dto);
  }
  @Post('generate-qr/:amount')
  async generateQrCode(@Param('amount') amount: number, @Body() body: { receiverPhone: string }) {
    const { receiverPhone } = body;

    const transactionData = {
      receiverPhone,
      amount,
    };

    // Generate QR code with transaction data
    const qrCode = await QRCode.toDataURL(JSON.stringify(transactionData));

    return {
      message: 'QR code generated successfully',
      qrCode,
    };
  }

  // Scan QR and send money (sender details are extracted from JWT token)
  @Post('send-from-qr')
  async sendFromQr(@Body() body: { qrCodeData: string }, @Req() req) {
    const senderId = req.user.userId; // Extract sender's ID from the JWT token
    const transactionData = JSON.parse(body.qrCodeData);
    const { receiverPhone, amount } = transactionData;

    return this.txService.sendMoney(senderId, { receiverPhone, amount });
  }

  @Post('verify-otp')
  verifyOtp(
    @Body() body: { transactionId: number; otp: string },
    @Req() req
  ) {
    return this.txService.verifyOtpAndCompleteTransaction(
      req.user.userId,
      body.transactionId,
      body.otp
    );
  }
}
