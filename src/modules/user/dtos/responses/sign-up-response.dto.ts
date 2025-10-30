import { Exclude } from 'class-transformer';
import { SoobookDto } from '../../../../common/interfaces/soobook.dto';

export class SignUpResponseDto extends SoobookDto {
  @Exclude()
  password: string;

  @Exclude()
  tokenVersion: number;
}
