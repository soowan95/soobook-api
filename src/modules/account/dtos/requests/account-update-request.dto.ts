import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';
import { AccountType } from '../../account.entity';
import { IsOptionalString } from '../../../../common/decorators/is-optional-string.decorator';
import { IsOptionalNumber } from '../../../../common/decorators/is-optional-number.decorator';
import { IsOptionalBoolean } from '../../../../common/decorators/is-optional-boolean.decorator';
import { SoobookDto } from '../../../../common/interfaces/soobook.dto';
import Decimal from 'decimal.js';

export class AccountUpdateRequestDto extends SoobookDto {
  @ApiProperty({
    description: '계좌명',
    example: '월급 통장',
  })
  @IsOptionalString()
  name?: string;

  @ApiProperty({
    description: '계좌 발급 기관명',
    example: '기업은행',
  })
  @IsOptionalString()
  institutionName?: string;

  @ApiProperty({
    description: '계좌 번호',
    example: '110123412344',
  })
  @IsOptionalString()
  number?: string;

  @ApiProperty({
    description: '계좌 유형',
    example: 'savingAccount',
  })
  @IsOptionalString()
  type?: AccountType;

  @ApiProperty({
    description: '신용카드 결제일',
    example: 25,
  })
  @IsOptionalNumber()
  @IsPositive()
  paymentDate?: number;

  @ApiProperty({
    description: '신용카드 한도',
    example: 10000000,
  })
  @IsOptionalString()
  limitAmount?: string;

  @ApiProperty({
    description: '계좌 사용 여부',
    example: true,
  })
  @IsOptionalBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: '계좌에 대한 간단한 설명',
    example: '월급 통장입니다.',
  })
  @IsOptionalString()
  description?: string;

  @ApiProperty({
    description: '최초 생성 시 잔액 - client 요청에서만 사용',
    example: 0,
  })
  @IsOptionalString()
  initialBalance?: Decimal;

  @ApiProperty({
    description: '현재 잔액 - transactionService 에서만 사용',
    example: 0,
  })
  @IsOptionalString()
  currentBalance?: Decimal;

  @ApiProperty({
    description: '신용카드 결제 계좌',
    example: 1,
  })
  @IsOptionalNumber()
  linkedAccountId?: number;
}
