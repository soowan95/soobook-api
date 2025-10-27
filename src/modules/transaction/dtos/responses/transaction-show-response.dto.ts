import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SoobookDto } from '../../../../common/interfaces/soobook.dto';
import Decimal from 'decimal.js';
import { TransactionType } from '../../transaction-type.enum';
import { Category } from '../../../category/category.entity';

@Exclude()
export class TransactionShowResponseDto extends SoobookDto {
  @ApiProperty({
    description: '거래 금액',
  })
  @Expose()
  amount: Decimal;

  @ApiProperty({
    description: '거래 종류',
  })
  @Expose()
  type: TransactionType;

  @ApiProperty({
    description: '간단한 설명',
  })
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({
    description: '긴 설명',
  })
  @IsOptional()
  @Expose()
  memo?: string;

  @ApiProperty({
    description: '사용처',
  })
  @Expose()
  location: string;

  @ApiProperty({
    description: '계좌 ID',
  })
  @Expose()
  @Transform(({ obj }) => obj.account.id, { toClassOnly: true })
  accountId: number;

  @ApiProperty({
    description: '카테고리 ID',
  })
  @Expose()
  category: Category;

  @ApiProperty({
    description: '내 계좌 간 이동 시 수령 계좌 ID',
  })
  @Expose()
  @Transform(({ obj }) => obj.toAccount?.id, { toClassOnly: true })
  toAccountId?: number;
}
