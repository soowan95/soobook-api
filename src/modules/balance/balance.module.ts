import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { balanceProviders } from './balance-provider';
import { BalanceService } from './balance.service';

@Module({
  imports: [DatabaseModule],
  providers: [...balanceProviders, BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
