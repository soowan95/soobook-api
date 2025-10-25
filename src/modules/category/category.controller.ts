import { Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { Role } from '../../common/decorators/user-role.decorator';
import { UserRole } from '../user/user.entity';

@ApiTags('- Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: '[Category] 생성',
  })
  @ApiBearerAuth()
  @ResponseMessage('success.create')
  @Role(UserRole.ADMIN)
  @Post('create')
  async create(): Promise<void> {
    console.log('category create');
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
