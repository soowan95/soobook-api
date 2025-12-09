import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { accountProvider } from './account-provider';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CurrencyModule } from '../currency/currency.module';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [DatabaseModule, BalanceModule, CurrencyModule],
  controllers: [AccountController],
  providers: [...accountProvider, AccountService],
  exports: [AccountService],
})
export class AccountModule {}
