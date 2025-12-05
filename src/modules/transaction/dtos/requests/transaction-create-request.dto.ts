import { ApiProperty } from '@nestjs/swagger';
import Decimal from 'decimal.js';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { IsOptionalString } from '../../../../common/decorators/is-optional-string.decorator';
import { IsOptionalNumber } from '../../../../common/decorators/is-optional-number.decorator';
import { TransactionType } from '../../transaction-type.enum';

export class TransactionCreateRequestDto {
  @ApiProperty({
    description: '거래 금액',
    example: '10000',
  })
  @IsNotEmpty({ message: '거래 금액은 필수값입니다.' })
  amount: Decimal;

  @ApiProperty({
    description: '거래 유형',
    example: 'income',
  })
  @IsNotEmpty({ message: '거래 유형는 필수값입니다.' })
  type: TransactionType;

  @ApiProperty({
    description: '짧은 설명',
    example: '햄버거',
  })
  @IsOptionalString()
  description?: string;

  @ApiProperty({
    description: '긴 설명',
    example: '운동을 가려했지만 햄버거를 먹어버림..',
  })
  @IsOptionalString()
  memo?: string;

  @ApiProperty({
    description: '사용처',
    example: '맘스터치 응암역점',
  })
  @IsNotEmpty({ message: '거래처는 필수값입니다.' })
  @IsOptionalString()
  location?: string;

  @ApiProperty({
    description: '카테고리 ID',
    example: 1,
  })
  @IsNumber()
  categoryId: number;

  @ApiProperty({
    description: '계좌 ID',
    example: 1,
  })
  @IsNotEmpty({ message: '계좌는 필수값입니다.' })
  @IsNumber()
  accountId: number;

  @ApiProperty({
    description: '내 계좌 간 이동 시 수령 계좌 ID',
    example: 2,
  })
  @IsOptionalNumber()
  toAccountId?: number;

  @ApiProperty({
    description: '통화 코드',
    example: 'KRW',
  })
  @IsOptionalString()
  currencyUnit?: string;
}
