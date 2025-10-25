import { SoobookDto } from '../../../../common/interfaces/soobook.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Account, AccountType } from '../../account.entity';
import { IsOptional } from 'class-validator';
import { User } from '../../../user/user.entity';
import { Exclude, Expose, Transform } from 'class-transformer';
import Decimal from 'decimal.js';

export class AccountCreateResponseDto extends SoobookDto {
  @ApiProperty({
    description: '계좌명',
  })
  name: string;

  @ApiProperty({
    description: '계좌 발급 기관명',
  })
  @IsOptional()
  institutionName?: string;

  @ApiProperty({
    description: '계좌 번호',
  })
  @IsOptional()
  number?: string;

  @ApiProperty({
    description: '계좌 유형',
  })
  type: AccountType;

  @ApiProperty({
    description: '신용카드 결제일',
  })
  @IsOptional()
  paymentDay?: number;

  @ApiProperty({
    description: '신용카드 한도',
  })
  @IsOptional()
  limitAmount?: string;

  @ApiProperty({
    description: '계좌 사용 여부',
  })
  isActive: boolean;

  @ApiProperty({
    description: '계좌에 대한 간단한 설명',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '최초 생성 시 잔액',
  })
  initialBalance: Decimal;

  @ApiProperty({
    description: '현재 잔액',
  })
  currentBalance: Decimal;

  @ApiProperty({
    description: '신용카드 결제 계좌',
  })
  @Expose()
  @Transform(({ obj }) => obj.linkedAccount.id, { toClassOnly: true })
  @IsOptional()
  linkedAccountId?: number;

  @Exclude()
  linkedAccount: Account;

  @Exclude()
  user: User;
}
