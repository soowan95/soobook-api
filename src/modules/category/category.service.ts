import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    if (!category) throw new NotFoundException('error.category.notFound');

    const parentCategory: Category | undefined = await this.findParent(
      request.parentId,
    );

    category = this.categoryRepository.merge(category, {
      ...request,
      parent: parentCategory,
    });

    return this.categoryRepository.save(category);
  }

  async delete(id: number, cascade: boolean): Promise<void> {
    const category: Category | null = await this.categoryRepository.findOne({
      where: {
        id: id,
      },
      relations: ['children'],
    });

    if (!category) throw new NotFoundException('error.category.notFound');

    if (category.children.length > 0) {
      const childIds: number[] = category.children.map((child) => child.id);
      if (cascade) {
        for (const childId of childIds) {
          await this.delete(childId, true);
        }
      } else {
        throw new ConflictException('warning.category.children');
      }
    }

    await this.categoryRepository.delete(id);
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
