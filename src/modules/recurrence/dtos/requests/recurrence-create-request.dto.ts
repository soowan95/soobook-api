import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import Decimal from 'decimal.js';
import { TransactionType } from '../../../transaction/transaction-type.enum';
import { RecurrencePeriodType } from '../../recurrence.entity';
import { IsOptionalNumber } from '../../../../common/decorators/is-optional-number.decorator';
import { IsOptionalDate } from '../../../../common/decorators/is-optional-date.decorator';
import { IsOptionalString } from '../../../../common/decorators/is-optional-string.decorator';
import { Type } from 'class-transformer';

export class RecurrenceCreateRequestDto {
  @ApiProperty({
    description: '계좌 ID',
    example: 1,
  })
  @IsNotEmpty({ message: '계좌 ID 는 필수값입니다.' })
  @IsNumber()
  accountId: number;

  @ApiProperty({
    description: '내 계좌 간 이동 시 수령 계좌 ID',
    example: 2,
  })
  @IsOptionalNumber()
  toAccountId?: number;

  @ApiProperty({
    description: '카테고리 ID',
    example: 1,
  })
  @IsNumber()
  categoryId: number;

  @ApiProperty({
    description: '거래처',
    example: '월급 통장',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: '금액',
    example: '500000',
  })
  @IsNotEmpty({ message: '금액은 필수값입니다.' })
  @IsString()
  amount: Decimal;

  @ApiProperty({
    description: '간단한 설명',
    example: '적금',
  })
  @IsOptionalString()
  description?: string;

  @ApiProperty({
    description: '거래 유형',
    example: 'expense',
  })
  @IsNotEmpty({ message: '거래 유형는 필수값입니다.' })
  type: TransactionType;

  @ApiProperty({
    description: '반복 주기',
    example: 'monthly',
  })
  @IsNotEmpty({ message: '반복 주기는 필수값입니다.' })
  periodType: RecurrencePeriodType;

  @ApiProperty({
    description: '반복 일 | 요일',
    example: 25,
  })
  @IsOptionalNumber()
  executeDay?: number;

  @ApiProperty({
    description: '종료 일',
    example: '2026-12-31 00:00:00',
  })
  @Type(() => Date)
  @IsOptionalDate()
  endDate?: Date;
}
