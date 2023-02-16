import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/models/entities/category.entity';
import { CategoryRepository } from 'src/models/repositories/category.repository';
import { CategoryDto } from './dtos/category.dto';

@Injectable()
export class CategoryService {
  private logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(Category) private categoryRepo: CategoryRepository,
  ) {}

  async getAllCategories() {
    const categories = await this.categoryRepo.find({
      relations: { assetModels: true, licenses: true },
    });
    const res = categories.map((category) => {
      const { assetModels, licenses, ...rest } = category;
      return {
        ...rest,
        assetModels: assetModels.length,
        licenses: licenses.length,
      };
    });
    return res;
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepo.findOneBy({ id });
    return category;
  }

  async createNewCategory(categoryDto: CategoryDto) {
    const category = new Category();
    category.name = categoryDto.name;
    await this.categoryRepo.save(category);
    return category;
  }

  async updateCategory(id: number, categoryDto: CategoryDto) {
    let toUpdate = await this.categoryRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, categoryDto);
    return await this.categoryRepo.save(updated);
  }

  async deleteCategory(id: number) {
    return await this.categoryRepo.delete({ id });
  }
}
