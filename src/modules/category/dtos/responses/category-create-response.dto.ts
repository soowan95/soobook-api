import { Exclude, Expose, Transform } from 'class-transformer';
import { Category } from '../../category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptionalNumber } from '../../../../common/decorators/is-optional-number.decorator';
import { SoobookDto } from '../../../../common/interfaces/soobook.dto';

export class CategoryCreateResponseDto extends SoobookDto {
  @ApiProperty({
    description: '부모 카테고리 ID',
  })
  @Expose()
  @Transform(({ obj }) => obj.parent.id, { toClassOnly: true })
  @IsOptionalNumber()
  parentId?: number;

  @Exclude()
  parent: Category;
}
