import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsStrongPassword } from 'class-validator';

export class UserUpdateRequestDto {
  @ApiProperty({
    description: '비밀번호',
    example: 'Qwer1234!',
  })
  @IsOptional()
  @IsStrongPassword(
    {},
    { message: '비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.' },
  )
  password?: string;

  @ApiProperty({
    description: '비밀번호 확인',
    example: 'Qwer1234!',
  })
  @IsOptional()
  passwordConfirm?: string;

  @ApiProperty({
    description: '핸드폰 번호 - 대한민국 기준',
    example: '01012231234',
  })
  @IsOptional()
  @IsPhoneNumber('KR', { message: '대한민국 핸드폰 번호 규칙을 따라야합니다.' })
  phoneNo?: string;

  @ApiProperty({
    description: '이름',
    example: '홍길동',
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '닉네임',
    example: 'Hong95',
  })
  @IsOptional()
  nickname?: string;
}
