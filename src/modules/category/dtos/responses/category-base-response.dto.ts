import { SoobookDto } from '../../../../common/interfaces/soobook.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class CategoryBaseResponseDto extends SoobookDto {
  @ApiProperty({
    description: '자식 카테고리',
  })
  @Expose()
  @Type(() => CategoryBaseResponseDto)
  @Transform(({ value }) => (value && value.length > 0 ? value : undefined))
  children?: CategoryBaseResponseDto[];
}
