import { forwardRef, Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction } from './transaction.entity';
import { User } from 'src/users/user.entity';
import { Wallet } from 'src/wallet/wallet.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmsModule } from 'src/ems/ems.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, Wallet]),
    forwardRef(() => AuthModule),EmsModule
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
