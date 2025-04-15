// src/transaction/transaction.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Wallet } from '../wallet/wallet.entity';
import { User } from '../users/user.entity';
import { SendMoneyDto } from './dto/send-money.dto';
import { EmsService } from '../ems/ems.service';  // Import the Email Service

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    private emsService: EmsService,  // Inject the Email Service
  ) {}

  async sendMoney(senderId: number, dto: SendMoneyDto) {
    const sender = await this.userRepo.findOne({ where: { id: senderId } });
    const receiver = await this.userRepo.findOne({ where: { phone: dto.receiverPhone } });
    
    if (!sender || !receiver) throw new NotFoundException('User not found');
    if (senderId === receiver.id) throw new BadRequestException('Cannot send to self');

    const senderWallet = await this.walletRepo.findOne({ where: { user: { id: sender.id } } });
    const receiverWallet = await this.walletRepo.findOne({ where: { user: { id: receiver.id } } });

    if (!senderWallet || !receiverWallet) throw new NotFoundException('Wallet not found');
    if (senderWallet.balance < dto.amount) throw new BadRequestException('Insufficient balance');

    const isHighValue = dto.amount > 5000;
    const otp = isHighValue ? Math.floor(100000 + Math.random() * 900000).toString() : null;

    const tx = this.txRepo.create({
      sender,
      receiver,
      amount: dto.amount,
      status: isHighValue ? 'PENDING' : 'COMPLETED',
    });

    await this.txRepo.save(tx);

    // Send email notification for the transaction
    await this.emsService.sendTransactionEmail(sender.email, 'Transaction Initiated', 
      `You have initiated a transaction of ${dto.amount} to ${receiver.name}. Transaction ID: ${tx.id}`);

    if (isHighValue) {
      // OTP for high-value transaction
      await this.emsService.sendOtpEmailForTransaction(sender.email, otp!); // Send OTP to sender email
      return { message: 'OTP sent for transaction', transactionId: tx.id };
    }

    // Low-value transaction → auto complete and send email
    senderWallet.balance = Number(senderWallet.balance)-Number(dto.amount);
    receiverWallet.balance =Number(receiverWallet.balance)+Number(dto.amount);
    await this.walletRepo.save([senderWallet, receiverWallet]);

    // Send email notification for successful transaction
    await this.emsService.sendTransactionSuccessEmail(sender.email, tx.id, dto.amount);

    return { message: 'Transaction successful', transactionId: tx.id };
  }

  async verifyOtpAndCompleteTransaction(senderId: number, transactionId: number, otp: string) {
    const tx = await this.txRepo.findOne({
      where: { id: transactionId },
      relations: ['sender', 'receiver'],
    });

    if (!tx || tx.sender.id !== senderId) throw new NotFoundException('Transaction not found');
    if (tx.status !== 'PENDING') throw new BadRequestException('Transaction not pending');
    if (tx.otp !== otp) throw new BadRequestException('Invalid OTP');

    const senderWallet = await this.walletRepo.findOne({ where: { user: { id: tx.sender.id } } });
    const receiverWallet = await this.walletRepo.findOne({ where: { user: { id: tx.receiver.id } } });

    if (!senderWallet || !receiverWallet) throw new NotFoundException('Wallet not found');
    if (senderWallet.balance < tx.amount) throw new BadRequestException('Insufficient balance');

    senderWallet.balance -= tx.amount;
    receiverWallet.balance += tx.amount;
    tx.status = 'COMPLETED';

    await this.walletRepo.save([senderWallet, receiverWallet]);
    await this.txRepo.save(tx);

    // Send email for successful completion after OTP verification
    await this.emsService.sendTransactionSuccessEmail(senderWallet.user.email, tx.id, tx.amount);

    return { message: 'Transaction completed after OTP verification' };
  }
  
}
