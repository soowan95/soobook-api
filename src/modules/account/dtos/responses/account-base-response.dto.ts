import { SoobookDto } from '../../../../common/interfaces/soobook.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Account } from '../../account.entity';
import { User } from '../../../user/user.entity';

export class AccountBaseResponseDto extends SoobookDto {
  @ApiProperty({
    description: '신용카드 결제 계좌',
  })
  @Expose()
  @Transform(({ obj }) => obj.linkedAccount?.id, { toClassOnly: true })
  linkedAccountId?: number;

  @ApiProperty({
    description: '신용카드 결제 계좌 이름',
  })
  @Expose()
  @Transform(({ obj }) => obj.linkedAccount?.name, { toClassOnly: true })
  linkedAccountName?: string;

  @Exclude()
  linkedAccount: Account;

  @Exclude()
  user: User;
}
