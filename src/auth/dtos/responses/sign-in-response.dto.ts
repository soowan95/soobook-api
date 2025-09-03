import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";

export class SignInResponseDto {
  @ApiProperty({
    description: '발급된 access 토큰',
  })
  @Transform(({ obj }) => obj.token, { toClassOnly: true })
  token: string;

  @ApiProperty({
    description: '이용자 email',
  })
  @Transform(({ obj }) => obj.user.email, { toClassOnly: true })
  email: string;

  @ApiProperty({
    description: '이용자 이름',
  })
  @Transform(({ obj }) => obj.user.name, { toClassOnly: true })
  name: string;

  @ApiProperty({
    description: '이용자 닉네임',
  })
  @Transform(({ obj }) => obj.user.nickname, { toClassOnly: true })
  nickname: string;
}
