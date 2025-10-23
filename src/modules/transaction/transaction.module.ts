import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { transactionProvider } from './transaction-provider';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TransactionController],
  providers: [...transactionProvider, TransactionService],
})
export class TransactionModule {}
