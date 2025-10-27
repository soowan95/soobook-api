import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { categoryProvider } from './category-provider';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [...categoryProvider, CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
