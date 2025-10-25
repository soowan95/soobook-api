import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RefreshRequestDto {
  @ApiProperty({
    description: '이용자 email',
    example: 'some-email123@gmail.com',
  })
  @IsEmail()
  email: string;
}
