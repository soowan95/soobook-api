import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SignUpResponseDto {
  @ApiProperty({
    description: '고유 id 로 사용할 Email',
  })
  @Transform(({ obj }) => obj.email, { toClassOnly: true })
  email: string;

  @ApiProperty({
    description: '핸드폰 번호 - 대한민국 기준',
  })
  @Transform(({ obj }) => obj.phoneNo, { toClassOnly: true })
  phoneNo: string;

  @ApiProperty({
    description: '이름',
  })
  @Transform(({ obj }) => obj.name, { toClassOnly: true })
  name: string;

  @ApiProperty({
    description: '닉네임',
  })
  @Transform(({ obj }) => obj.nickname, { toClassOnly: true })
  nickname: string;
}
