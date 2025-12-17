import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SoobookDto } from '../../../../common/interfaces/soobook.dto';
import { Account } from '../../../account/account.entity';
import { User } from '../../../user/user.entity';
import { Category } from '../../../category/category.entity';
import { Recurrence } from '../../../recurrence/recurrence.entity';
import { Currency } from '../../../currency/currency.entity';

export class TransactionBaseResponseDto extends SoobookDto {
  @ApiProperty({
    description: '계좌 ID',
  })
  @Expose()
  @Transform(({ obj }) => obj.account.id, { toClassOnly: true })
  accountId: number;

  @ApiProperty({
    description: '계좌 명',
  })
  @Expose()
  @Transform(({ obj }) => obj.account.name, { toClassOnly: true })
  accountName: string;

  @ApiProperty({
    description: '내 계좌 간 이동 시 수령 계좌 ID',
  })
  @Expose()
  @Transform(({ obj }) => obj.toAccount?.id, { toClassOnly: true })
  toAccountId?: number;

  @ApiProperty({
    description: '내 계좌 간 이동 시 수령 계좌 명',
  })
  @Expose()
  @Transform(({ obj }) => obj.toAccount?.name, { toClassOnly: true })
  toAccountName?: string;

  @ApiProperty({
    description: '카테고리 ID',
  })
  @Expose()
  @Transform(({ obj }) => obj.category.id, { toClassOnly: true })
  categoryId: number;

  @ApiProperty({
    description: '카테고리 명',
  })
  @Expose()
  @Transform(({ obj }) => obj.category.name, { toClassOnly: true })
  categoryName: string;

  @ApiProperty({
    description: '반복 ID',
  })
  @Expose()
  @Transform(({ obj }) => obj.recurrence?.id, { toClassOnly: true })
  recurrenceId?: number;

  @ApiProperty({
    description: '통화 코드',
  })
  @Expose()
  @Transform(({ obj }) => obj.currency?.unit, { toClassOnly: true })
  unit: string;

  @ApiProperty({
    description: '거리 일시',
  })
  @Expose()
  @Type(() => Date)
  commitAt: Date;

  @Exclude()
  account: Account;

  @Exclude()
  toAccount?: Account;

  @Exclude()
  user: User;

  @Exclude()
  category: Category;

  @Exclude()
  recurrence: Recurrence;

  @Exclude()
  currency: Currency;
}
