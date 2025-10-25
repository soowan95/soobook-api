import { TransactionType } from '../../transaction.entity';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SoobookDto } from '../../../../common/interfaces/soobook.dto';

@Exclude()
export class TransactionShowResponseDto extends SoobookDto {
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

  @ApiProperty({
    description: '계좌 고유 식별자'
  })
  @Expose()
  @Transform(({ obj }) => obj.account.id, { toClassOnly: true })
  accountId: number;
}