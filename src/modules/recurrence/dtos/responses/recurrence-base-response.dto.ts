import { SoobookDto } from '../../../../common/interfaces/soobook.dto';
import { Exclude, Expose, Transform } from 'class-transformer';
import { User } from '../../../user/user.entity';
import { Account } from '../../../account/account.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RecurrenceBaseResponseDto extends SoobookDto {
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

  @Exclude()
  user: User;

  @Exclude()
  account: Account;
}
