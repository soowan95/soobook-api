import { SoobookDto } from '../../../../common/interfaces/soobook.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Category } from '../../category.entity';

export class CategoryBaseResponseDto extends SoobookDto {
  @ApiProperty({
    description: '부모 카테고리 ID',
  })
  @Expose()
  @Transform(({ obj }) => obj.parent?.id, { toClassOnly: true })
  parentId?: number;

  @ApiProperty({
    description: '부모 카테고리 명',
  })
  @Expose()
  @Transform(({ obj }) => obj.parent?.name, { toClassOnly: true })
  parentName?: string;

  @Exclude()
  parent: Category;
}
