import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { accountProvider } from './account-provider';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AccountController],
  providers: [...accountProvider, AccountService],
})
export class AccountModule {}
