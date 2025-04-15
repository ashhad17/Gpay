import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QrService {
  
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  async generateDynamicQr(senderId: string, receiverPhone: string, amount: number): Promise<string> {
    const payload = {
      senderId,
      receiverPhone,
      amount
    };
  
    const qr = await QRCode.toDataURL(JSON.stringify(payload));
    return qr.replace(/^data:image\/png;base64,/, '');
  }
  
  // Generates fixed QR for the user
  async generateFixedQr(userId: number): Promise<string> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const qrData = `user_id:${user.id},receiverPhone:${user.phone}`;
    const qrCode = await QRCode.toDataURL(qrData);

    return qrCode; // returns base64 QR image
  }

  // Generates fixed amount QR for transactions
  async generateFixedAmountQr(amount: number): Promise<string> {
    const qrData = `amount:${amount}`;
    const qrCode = await QRCode.toDataURL(qrData);

    return qrCode; // returns base64 QR image
  }
}
