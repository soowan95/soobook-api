import { SoobookDto } from '../../../../common/interfaces/soobook.dto';
import { Exclude, Expose, Transform } from 'class-transformer';
import { User } from '../../../user/user.entity';
import { Account } from '../../../account/account.entity';

export class RecurrenceCreateResponseDto extends SoobookDto {
  @Expose()
  @Transform(({ obj }) => obj.account.id, { toClassOnly: true })
  accountId: number;

  @Exclude()
  user: User;

  @Exclude()
  account: Account;
}
