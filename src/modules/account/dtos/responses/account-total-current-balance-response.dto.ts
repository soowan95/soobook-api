import { ApiProperty } from '@nestjs/swagger';
import Decimal from 'decimal.js';

export class AccountTotalCurrentBalanceResponse {
  constructor(currentBalance: Decimal) {
    this.currentBalance = currentBalance.toString();
  }
  @ApiProperty({
    description: '총 잔액',
  })
  currentBalance: string;
}
