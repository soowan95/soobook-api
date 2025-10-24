import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export abstract class SoobookDto {
  @ApiProperty({
    description: '고유 식별자',
  })
  @Expose()
  id: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  updatedIp: string;
}
