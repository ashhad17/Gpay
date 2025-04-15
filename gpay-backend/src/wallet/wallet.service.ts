import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getBalance(userId: number) {
    const wallet = await this.walletRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!wallet) throw new NotFoundException('Wallet not found');
    return { balance: wallet.balance };
  }
  async addBalance(userId: number, amount: number) {
    // Find the user's wallet by userId and ensure the 'user' relation is loaded
    const wallet = await this.walletRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],  // Ensure 'user' relation is loaded
    });
  
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
  
    if (!wallet.user) {
      throw new NotFoundException('User associated with wallet not found');
    }
  
    // Ensure the amount to be added is positive
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
  
    // Add the specified amount to the balance
    wallet.balance =Number(wallet.balance)+Number(amount);
  
    // Save the updated wallet
    await this.walletRepo.save(wallet);
  
    return {
      message: 'Balance added successfully',
      wallet: {
        userId: wallet.user.id,  // Safe to access user.id now
        newBalance: wallet.balance,
      },
    };
  }
  
}
