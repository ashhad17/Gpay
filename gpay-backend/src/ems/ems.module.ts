import { Module } from '@nestjs/common';
import { EmsService } from './ems.service';

@Module({
  providers: [EmsService],
  exports: [EmsService], // to use in AuthService or TransactionService
})
export class EmsModule {}
