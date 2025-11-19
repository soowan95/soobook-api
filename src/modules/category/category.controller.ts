import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { Role } from '../../common/decorators/user-role.decorator';
import { UserRole } from '../user/user.entity';
import { CategoryCreateRequestDto } from './dtos/requests/category-create-request.dto';
import { plainToInstance } from 'class-transformer';
import { Category } from './category.entity';
import { CategoryUpdateRequestDto } from './dtos/requests/category-update-request.dto';
import { CategoryBaseResponseDto } from './dtos/responses/category-base-response.dto';

@ApiTags('- Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: '[Category] 생성',
  })
  @ApiBody({ type: CategoryCreateRequestDto })
  @ApiOkResponse({ type: CategoryBaseResponseDto })
  @ApiBearerAuth()
  @ResponseMessage('success.create')
  @Role(UserRole.ADMIN)
  @Post('create')
  async create(
    @Body() createReq: CategoryCreateRequestDto,
  ): Promise<CategoryBaseResponseDto> {
    const category: Promise<Category> = this.categoryService.create(createReq);

    return plainToInstance(CategoryBaseResponseDto, category);
  }

  @ApiOperation({
    summary: '[Category] 전체 조회',
  })
  @ApiOkResponse({ type: CategoryBaseResponseDto, isArray: true })
  @ApiBearerAuth()
  @ResponseMessage('success.read')
  @Get('retrieve')
  async retrieve(): Promise<CategoryBaseResponseDto[]> {
    const categories: Category[] = await this.categoryService.findAll();

    return plainToInstance(CategoryBaseResponseDto, categories);
  }

  @ApiOperation({
    summary: '[Category] 갱신',
  })
  @ApiBody({ type: CategoryUpdateRequestDto })
  @ApiOkResponse({ type: CategoryBaseResponseDto })
  @ApiBearerAuth()
  @ResponseMessage('success.update')
  @Role(UserRole.ADMIN)
  @Put('update')
  async update(
    @Body() updateReq: CategoryUpdateRequestDto,
  ): Promise<CategoryBaseResponseDto> {
    const category: Promise<Category> = this.categoryService.update(updateReq);

    return plainToInstance(CategoryBaseResponseDto, category);
  }

  @ApiOperation({
    summary: '[Category] 삭제',
  })
  @ApiBearerAuth()
  @ApiQuery({ name: 'cascade', required: false })
  @ApiParam({ name: 'id', required: true })
  @ResponseMessage('success.delete')
  @Role(UserRole.ADMIN)
  @Delete('delete/:id')
  async delete(
    @Param('id') id: number,
    @Query('cascade') cascade: boolean = false,
  ): Promise<void> {
    await this.categoryService.delete(id, cascade);
  }
}
