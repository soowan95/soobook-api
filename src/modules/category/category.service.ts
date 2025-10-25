import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryCreateRequestDto } from './dtos/requests/category-create-request.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoryRepository: Repository<Category>,
  ) {}

  async create(request: CategoryCreateRequestDto): Promise<Category> {
    return await this.categoryRepository.save({
      ...request,
      parent:
        (await this.categoryRepository.findOneBy({ id: request.parentId })) ??
        undefined,
    });
  }

  async findAll(): Promise<void> {
    console.log('retrieve category');
  }
}
