import { SoobookDto } from '../../../../common/interfaces/soobook.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptionalString } from '../../../../common/decorators/is-optional-string.decorator';
import { IsOptionalNumber } from '../../../../common/decorators/is-optional-number.decorator';

export class CategoryUpdateRequestDto extends SoobookDto {
  @ApiProperty({
    description: '카테고리 명',
    example: '문화생활',
  })
  @IsOptionalString()
  name?: string;

  @ApiProperty({
    description: '부모 카테고리 ID',
    example: 1,
  })
  @IsOptionalNumber()
  parentId?: number;
}
