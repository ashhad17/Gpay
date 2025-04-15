import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

// Placeholder modules (we'll implement each step-by-step)
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
// import { WalletModule } from './wallet/wallet.module';
// import { TransactionsModule } from './transactions/transactions.module';
// import { QrModule } from './qr/qr.module';
// import { NotificationsModule } from './notifications/notifications.module';
// import { UsersModule } from './users/users.module';
// import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { EmsModule } from './ems/ems.module';
import { QrModule } from './qr/qr.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    AuthModule,
    UsersModule,
    WalletModule,
    TransactionModule,
    EmsModule,
    QrModule,
    // WalletModule,
    // TransactionsModule,
    // QrModule,
    // NotificationsModule,
  ],
})
export class AppModule {}
