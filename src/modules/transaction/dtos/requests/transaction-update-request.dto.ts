import { SoobookDto } from '../../../../common/interfaces/soobook.dto';
import Decimal from 'decimal.js';
import { TransactionType } from '../../transaction-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptionalNumber } from '../../../../common/decorators/is-optional-number.decorator';
import { IsOptionalString } from '../../../../common/decorators/is-optional-string.decorator';

export class TransactionUpdateRequestDto extends SoobookDto {
  @ApiProperty({
    description: '계좌 ID',
    example: 1,
  })
  @IsOptionalNumber()
  accountId?: number;

  @ApiProperty({
    description: '내 계좌 간 이동 시 수령 계좌 ID',
    example: 2,
  })
  @IsOptionalNumber()
  toAccountId?: number;

  @ApiProperty({
    description: '금액',
    example: '10000',
  })
  @IsOptionalString()
  amount?: Decimal;

  @ApiProperty({
    description: '카테고리 ID',
    example: 1,
  })
  @IsOptionalNumber()
  categoryId?: number;

  @ApiProperty({
    description: '거래 유형',
    example: 'expense',
  })
  @IsOptionalString()
  type?: TransactionType;

  @ApiProperty({
    description: '간단한 설명',
    example: '피자',
  })
  @IsOptionalString()
  description?: string;

  @ApiProperty({
    description: '긴 설명',
    example: '햄버거가 아니라 피자였음.',
  })
  @IsOptionalString()
  memo?: string;

  @ApiProperty({
    description: '거래처',
    example: '도미노 피자',
  })
  @IsOptionalString()
  location?: string;
}
