import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { transactionProvider } from './transaction-provider';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { AccountModule } from '../account/account.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [DatabaseModule, AccountModule, CategoryModule],
  controllers: [TransactionController],
  providers: [...transactionProvider, TransactionService],
})
export class TransactionModule {}
