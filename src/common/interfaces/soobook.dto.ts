import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export abstract class SoobookDto {
  @ApiProperty({
    description: '고유 식별자',
  })
  @IsNotEmpty({ message: 'ID 는 필수값입니다.' })
  @Expose()
  id: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  updatedIp: string;
}
