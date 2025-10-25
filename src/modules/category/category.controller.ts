import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { Role } from '../../common/decorators/user-role.decorator';
import { UserRole } from '../user/user.entity';
import { CategoryCreateRequestDto } from './dtos/requests/category-create-request.dto';
import { CategoryCreateResponseDto } from './dtos/responses/category-create-response.dto';
import { plainToInstance } from 'class-transformer';
import { Category } from './category.entity';
import { CategoryReadResponseDto } from './dtos/responses/category-read-response.dto';
import { CategoryUpdateRequestDto } from './dtos/requests/category-update-request.dto';

@ApiTags('- Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: '[Category] 생성',
  })
  @ApiBody({ type: CategoryCreateRequestDto })
  @ApiOkResponse({ type: CategoryCreateResponseDto })
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
  @ApiOkResponse({ type: CategoryReadResponseDto, isArray: true })
  @ApiBearerAuth()
  @ResponseMessage('success.read')
  @Get('retrieve')
  async retrieve(): Promise<CategoryReadResponseDto[]> {
    const categories: Category[] = await this.categoryService.findAll();

    return plainToInstance(CategoryReadResponseDto, categories);
  }

  @ApiOperation({
    summary: '[Category] 갱신',
  })
  @ApiBody({ type: CategoryUpdateRequestDto })
  @ApiOkResponse({ type: CategoryReadResponseDto })
  @ApiBearerAuth()
  @ResponseMessage('success.update')
  @Role(UserRole.ADMIN)
  @Put('update')
  async update(
    @Body() updateReq: CategoryUpdateRequestDto,
  ): Promise<CategoryReadResponseDto> {
    const category: Promise<Category> = this.categoryService.update(updateReq);

    return plainToInstance(CategoryReadResponseDto, category);
  }
}
