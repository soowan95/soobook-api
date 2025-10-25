import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { Role } from '../../common/decorators/user-role.decorator';
import { UserRole } from '../user/user.entity';
import { CategoryCreateRequestDto } from './dtos/requests/category-create-request.dto';
import { CategoryCreateResponseDto } from './dtos/responses/category-create-response.dto';
import { plainToInstance } from 'class-transformer';
import { Category } from './category.entity';

@ApiTags('- Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: '[Category] 생성',
  })
  @ApiBody({ type: CategoryCreateRequestDto })
  @ApiBearerAuth()
  @ResponseMessage('success.create')
  @Role(UserRole.ADMIN)
  @Post('create')
  async create(
    @Body() createReq: CategoryCreateRequestDto,
  ): Promise<CategoryCreateResponseDto> {
    const category: Promise<Category> = this.categoryService.create(createReq);

    return plainToInstance(CategoryCreateResponseDto, category);
  }

  @ApiOperation({
    summary: '[Category] 전체 조회',
  })
  @ApiBearerAuth()
  @ResponseMessage('success.read')
  @Get('retrieve')
  async retrieve(): Promise<void> {
    await this.categoryService.findAll();
  }
}
