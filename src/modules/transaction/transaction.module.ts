import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { transactionProvider } from './transaction-provider';

@Module({
  imports: [DatabaseModule],
  providers: [...transactionProvider],
})
export class TransactionModule {}
