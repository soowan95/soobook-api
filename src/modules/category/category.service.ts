import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<void> {
    console.log('retrieve category');
  }
}
