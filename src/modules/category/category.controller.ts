import {
  Controller,
  Get,
  UseGuards,
  Post,
  Put,
  Body,
  ParseIntPipe,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { CategoryService } from './category.service';
import { CategoryDto } from './dtos/category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Get('get-category-by-id/:id')
  @UseGuards(JwtAllAuthGuard)
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.getCategoryById(id);
  }

  @Post('create-category')
  @UseGuards(JwtAdminAuthGuard)
  async createCategory(@Body() categoryDto: CategoryDto) {
    return await this.categoryService.createNewCategory(categoryDto);
  }

  @Put('update-category')
  @UseGuards(JwtAdminAuthGuard)
  async updateCategory(
    @Body() categoryDto: CategoryDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.categoryService.updateCategory(id, categoryDto);
  }

  @Delete('delete-category')
  @UseGuards(JwtAdminAuthGuard)
  async deleteCategory(@Body('id', ParseIntPipe) id: number) {
    return await this.categoryService.deleteCategory(id);
  }
}
