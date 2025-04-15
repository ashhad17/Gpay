import { Body, Controller, Get, Param, Post, Req, Request, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get('balance')
  getBalance(@Req() req) {
    return this.walletService.getBalance(req.user.userId);
  }
  @Post('add-money')
@UseGuards(JwtAuthGuard)
addMoney(@Request() req, @Body() body: { amount: number }) {
  const userId = req.user.id;
  return this.walletService.addBalance(userId, body.amount);
}
}
