import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { transactionProvider } from './transaction-provider';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { AccountModule } from '../account/account.module';
import { CategoryModule } from '../category/category.module';
import { CurrencyModule } from '../currency/currency.module';

@Module({
  imports: [DatabaseModule, AccountModule, CategoryModule, CurrencyModule],
  controllers: [TransactionController],
  providers: [...transactionProvider, TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
