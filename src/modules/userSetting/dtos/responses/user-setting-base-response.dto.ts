import { SoobookDto } from '../../../../common/interfaces/soobook.dto';
import { Exclude } from 'class-transformer';
import { User } from '../../../user/user.entity';

export class UserSettingBaseResponseDto extends SoobookDto {
  @Exclude()
  user: User;
}
