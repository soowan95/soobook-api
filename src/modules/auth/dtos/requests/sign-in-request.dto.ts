import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInRequestDto {
  @ApiProperty({
    description: '이용자 email',
    example: 'some-email123@gmail.com',
  })
  @IsString()
  @IsNotEmpty({ message: '이메일은 필수값입니다.' })
  email: string;

  @ApiProperty({
    description: '이용자 비밀번호',
    example: 'Qwer1234!',
  })
  @IsString()
  @IsNotEmpty({ message: '비밀번호는 필수값입니다.' })
  password: string;
}
