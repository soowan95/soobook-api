import { TransactionType } from '../../transaction.entity';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@Exclude()
export class TransactionShowResponseDto {
  @ApiProperty({
    description: '거래 금액'
  })
  @Expose()
  amount: string;

  @ApiProperty({
    description: '거래 종류'
  })
  @Expose()
  type: TransactionType;

  @ApiProperty({
    description: '간단한 설명'
  })
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({
    description: '긴 설명'
  })
  @IsOptional()
  @Expose()
  memo?: string;

  @ApiProperty({
    description: '사용처'
  })
  @Expose()
  location: string;
}