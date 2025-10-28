import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { SoobookDto } from '../../../../common/interfaces/soobook.dto';

@Exclude()
export class UserUpdateResponseDto extends SoobookDto {
  @ApiProperty({
    description: '핸드폰 번호 - 대한민국 기준',
  })
  @IsOptional()
  @Expose()
  phoneNo?: string;

  @ApiProperty({
    description: '이름',
  })
  @IsOptional()
  @Expose()
  name?: string;

  @ApiProperty({
    description: '닉네임',
  })
  @IsOptional()
  @Expose()
  nickname?: string;
}
