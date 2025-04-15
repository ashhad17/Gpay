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
  async generateFixedQr(senderId: number, receiverPhone: string, amount: number) {
    // Generate QR Code containing both receiver's phone and amount
    const payload = {
      senderId,
      receiverPhone,
    };
  
    const qr = await QRCode.toDataURL(JSON.stringify(payload));
    return qr.replace(/^data:image\/png;base64,/, '');
    
  }

  // Generate QR Code Helper
  private async generateQRCode(data: string) {
    // Use a package like `qrcode` or `qr-image` to generate the QR image
    const qrCode = await QRCode.toDataURL(data);
    return qrCode;
  }
  // Generates fixed amount QR for transactions
  async generateFixedAmountQr(amount: number): Promise<string> {
    const qrData = `amount:${amount}`;
    const qrCode = await QRCode.toDataURL(qrData);

    return qrCode; // returns base64 QR image
  }
}
