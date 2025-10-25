import { SoobookDto } from '../../../../common/interfaces/soobook.dto';
import { Exclude, Expose, Transform } from 'class-transformer';
import { User } from '../../../user/user.entity';
import { Account } from '../../account.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AccountReadResponseDto extends SoobookDto {
  @ApiProperty({
    description: '신용카드 결제 계좌'
  })
  @Expose()
  @Transform(({ obj }) => obj.linkedAccount?.id, { toClassOnly: true })
  @IsOptional()
  linkedAccountId?: number;

  @Exclude()
  user: User;

  @Exclude()
  linkedAccount: Account;
}