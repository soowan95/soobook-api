import { SoobookDto } from '../../../../common/interfaces/soobook.dto';
import Decimal from 'decimal.js';
import { TransactionType } from '../../../transaction/transaction-type.enum';
import { RecurrencePeriodType } from '../../recurrence.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptionalString } from '../../../../common/decorators/is-optional-string.decorator';
import { IsOptionalNumber } from '../../../../common/decorators/is-optional-number.decorator';
import { Type } from 'class-transformer';
import { IsOptionalDate } from '../../../../common/decorators/is-optional-date.decorator';

export class RecurrenceUpdateRequestDto extends SoobookDto {
  @ApiProperty({
    description: '계좌 ID',
    example: 1,
  })
  @IsOptionalNumber()
  accountId?: number;

  @ApiProperty({
    description: '금액',
    example: '50000',
  })
  @IsOptionalString()
  amount?: Decimal;

  @ApiProperty({
    description: '간단한 설명',
    example: '예금',
  })
  @IsOptionalString()
  description?: string;

  @ApiProperty({
    description: '거래 종류',
    example: 'income',
  })
  @IsOptionalString()
  type?: TransactionType;

  @ApiProperty({
    description: '반복 주기',
    example: 'weekly',
  })
  @IsOptionalString()
  periodType?: RecurrencePeriodType;

  @ApiProperty({
    description: '반복 일 | 요일',
    example: 31,
  })
  @IsOptionalNumber()
  executeDay?: number;

  @ApiProperty({
    description: '종료 일',
    example: '2026-10-31 00:00:00',
  })
  @Type(() => Date)
  @IsOptionalDate()
  endDate?: Date;
}
