import { TransactionType } from '../../transaction.entity';
import { ApiProperty } from '@nestjs/swagger';
import Decimal from 'decimal.js';
import { IsNotEmpty, IsString } from 'class-validator';

export class TransactionCreateRequestDto {
  @ApiProperty({
    description: '거래 금액',
    example: '10000',
  })
  @IsNotEmpty({ message: '거래 금액은 필수값입니다.' })
  amount: Decimal;

  @ApiProperty({
    description: '거래 종류',
    example: 'income',
  })
  @IsNotEmpty({ message: '거래 종류는 필수값입니다.' })
  type: TransactionType;

  @ApiProperty({
    description: '짧은 설명',
    example: '햄버거',
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: '긴 설명',
    example: '운동을 가려했지만 햄버거를 먹어버림..',
  })
  @IsString()
  memo?: string;

  @ApiProperty({
    description: '사용처',
    example: '맘스터치 응암역점',
  })
  @IsNotEmpty({ message: '거래처는 필수값입니다.' })
  @IsString()
  location: string;
}
