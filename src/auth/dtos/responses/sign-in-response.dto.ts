import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class SignInResponseDto {
  @ApiProperty({
    description: '발급된 access 토큰',
  })
  @Expose()
  @Transform(({ obj }) => obj.accessToken, { toClassOnly: true })
  atk: string;

  @ApiProperty({
    description: '발급된 refresh 토큰',
  })
  @Expose()
  @Transform(({ obj }) => obj.refreshToken, { toClassOnly: true })
  rtk: string;

  @ApiProperty({
    description: '이용자 email',
  })
  @Expose()
  @Transform(({ obj }) => obj.user.email, { toClassOnly: true })
  email: string;

  @ApiProperty({
    description: '이용자 이름',
  })
  @Expose()
  @Transform(({ obj }) => obj.user.name, { toClassOnly: true })
  name: string;

  @ApiProperty({
    description: '이용자 닉네임',
  })
  @Expose()
  @Transform(({ obj }) => obj.user.nickname, { toClassOnly: true })
  nickname: string;
}
