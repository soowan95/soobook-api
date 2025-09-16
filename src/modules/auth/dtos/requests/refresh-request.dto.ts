import { ApiProperty } from '@nestjs/swagger';

export class RefreshRequestDto {
  @ApiProperty({
    description: '이용자 email',
    example: 'some-email123@gmail.com'
  })
  email: string;
}
