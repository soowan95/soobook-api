import { TransactionType } from '../../transaction.entity';
import { ApiProperty } from '@nestjs/swagger';
import Decimal from 'decimal.js';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '긴 설명',
    example: '운동을 가려했지만 햄버거를 먹어버림..',
  })
  @IsString()
  @IsOptional()
  memo?: string;

  @ApiProperty({
    description: '사용처',
    example: '맘스터치 응암역점',
  })
  @IsNotEmpty({ message: '거래처는 필수값입니다.' })
  @IsString()
  location: string;

  @ApiProperty({
    description: '계좌 고유 식별자',
    example: 1,
  })
  @IsNotEmpty({ message: '계좌는 필수값읍니다.' })
  @IsNumber()
  accountId: number;
}
