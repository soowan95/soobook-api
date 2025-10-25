import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsOptionalNumber } from '../../../../common/decorators/is-optional-number.decorator';

export class CategoryCreateRequestDto {
  @ApiProperty({
    description: '카테고리 명',
    example: '외식',
  })
  @IsString()
  @IsNotEmpty({ message: '카테고리 명은 필수값입니다.'})
  name: string;

  @ApiProperty({
    description: '부모 카테고리 ID',
    example: 1,
  })
  @IsOptionalNumber()
  parentId?: number;
}