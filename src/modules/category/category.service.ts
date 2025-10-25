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
      parent: request.parentId
        ? ((await this.categoryRepository.findOneBy({
            id: request.parentId,
          })) ?? undefined)
        : undefined,
    });
  }

  async findAll(): Promise<Category[]> {
    console.log(await this.categoryRepository.find({ relations: ['parent'] }));
    return await this.categoryRepository.find({ relations: ['parent'] });
  }
}
