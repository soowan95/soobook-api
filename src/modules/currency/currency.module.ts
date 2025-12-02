import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from '../../database/database.module';
import { currencyProvider } from './currency-provider';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';

@Module({
  imports: [
    DatabaseModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [CurrencyController],
  providers: [...currencyProvider, CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
