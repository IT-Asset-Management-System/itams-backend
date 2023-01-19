import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { CategoryService } from './category.service';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }
}
