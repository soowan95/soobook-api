import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';

export class SignUpRequestDto {
  @ApiProperty({
    description: '고유 id 로 사용할 Email',
    example: 'some-email123@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'Email 은 필수값입니다.' })
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'Qwer1234!',
  })
  @IsStrongPassword(
    {},
    { message: '비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.' },
  )
  password: string;

  @ApiProperty({
    description: '핸드폰 번호 - 대한민국 기준',
    example: '01012231234',
  })
  @IsPhoneNumber('KR', { message: '대한민국 핸드폰 번호 규칙을 따라야합니다.' })
  phoneNo: string;

  @ApiProperty({
    description: '이름',
    example: '홍길동',
  })
  @IsNotEmpty({ message: '이름은 필수값입니다.' })
  name: string;

  @ApiProperty({
    description: '닉네임',
    example: 'Hong95',
  })
  @IsOptional()
  nickname?: string;

  @ApiProperty({
    description: '게스트 여부',
    example: false,
  })
  isGuest: boolean;
}
