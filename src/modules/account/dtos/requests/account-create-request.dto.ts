import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { AccountType } from '../../account.entity';

export class AccountCreateRequestDto {
  @ApiProperty({
    description: '계좌명',
    example: '월급 통장',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '계좌 발급 기관명',
    example: '기업은행',
  })
  @IsString()
  @IsOptional()
  institutionName?: string;

  @ApiProperty({
    description: '계좌 번호',
    example: '110123412344',
  })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiProperty({
    description: '계좌 유형',
    example: 'savingAccount',
  })
  @IsString()
  type: AccountType;

  @ApiProperty({
    description: '신용카드 결제일',
    example: 25,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  paymentDate?: number;

  @ApiProperty({
    description: '신용카드 한도',
    example: 10000000,
  })
  @IsString()
  @IsOptional()
  limitAmount?: string;

  @ApiProperty({
    description: '계좌 사용 여부',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: '계좌에 대한 간단한 설명',
    example: '월급 통장입니다.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '최초 생성 시 잔액',
    example: 0,
  })
  @IsString()
  initialBalance: string;

  @ApiProperty({
    description: '신용카드 결제 계좌',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  linkedAccountId?: number;
}
