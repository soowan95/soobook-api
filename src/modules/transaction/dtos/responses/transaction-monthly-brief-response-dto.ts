import Decimal from 'decimal.js';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionMonthlyBriefResponseDto {
  constructor(income: Decimal, expense: Decimal) {
    this.income = income.toString();
    this.expense = expense.toString();
  }
  @ApiProperty({
    description: '수입'
  })
  income: string
  @ApiProperty({
    description: '지출'
  })
  expense: string
}