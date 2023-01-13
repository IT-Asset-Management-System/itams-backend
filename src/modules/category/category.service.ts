import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/models/entities/category.entity';
import { CategoryRepository } from 'src/models/repositories/category.repository';

@Injectable()
export class CategoryService {
  private logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(Category) private categoryRepo: CategoryRepository,
  ) {}

  async getCategories() {
    const categories = await this.categoryRepo.find();
    return categories;
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepo.findOneBy({ id });
    return category;
  }
}
