import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryCreateRequestDto } from './dtos/requests/category-create-request.dto';
import { CategoryUpdateRequestDto } from './dtos/requests/category-update-request.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoryRepository: Repository<Category>,
  ) {}

  async create(request: CategoryCreateRequestDto): Promise<Category> {
    return await this.categoryRepository.save({
      ...request,
      parent: await this.findParent(request.parentId),
    });
  }

  async findAll(): Promise<Category[]> {
    console.log(await this.categoryRepository.find({ relations: ['parent'] }));
    return await this.categoryRepository.find({ relations: ['parent'] });
  }

  async update(request: CategoryUpdateRequestDto): Promise<Category> {
    let category: Category | null = await this.categoryRepository.findOneBy({
      id: request.id,
    });

    if (!category) throw new Error('error.category.notFound');

    const parentCategory: Category | undefined = await this.findParent(
      request.parentId,
    );

    category = this.categoryRepository.merge(category, {
      ...request,
      parent: parentCategory,
    });

    return this.categoryRepository.save(category);
  }

  private async findParent(
    parentId: number | undefined,
  ): Promise<Category | undefined> {
    if (!parentId) return undefined;
    return (
      (await this.categoryRepository.findOneBy({
        id: parentId,
      })) ?? undefined
    );
  }
}
