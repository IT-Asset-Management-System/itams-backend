import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Deprecation from '../../Models/Entities/Deprecation.entity';
import { DeprecationRepository } from '../../Models/Repositories/Deprecation.repository';
import { CategoryService } from '../category/category.service';
import { DeprecationDto } from './Dtos/Deprecation.dto';

@Injectable()
export class DeprecationService {
  private logger = new Logger(DeprecationService.name);

  constructor(
    @InjectRepository(Deprecation)
    private deprecationRepo: DeprecationRepository,
    private categoryService: CategoryService,
  ) {}

  async getAllDeprecations() {
    const deprecations = await this.deprecationRepo.find({
      relations: { category: true },
    });
    const res = deprecations.map((deprecation) => {
      const { category, ...rest } = deprecation;
      return {
        ...rest,
        category: category.name,
      };
    });
    return res;
  }

  async getDeprecationById(id: number) {
    const deprecation = await this.deprecationRepo.findOneBy({ id });
    return deprecation;
  }

  async createNewDeprecation(deprecationDto: DeprecationDto) {
    if (
      await this.deprecationRepo.findOne({
        where: { category: { id: deprecationDto.categoryId } },
      })
    )
      throw new HttpException(
        'This category has been set',
        HttpStatus.BAD_REQUEST,
      );
    const deprecation = new Deprecation();
    deprecation.name = deprecationDto.name;
    deprecation.months = deprecation.months;
    const category = await this.categoryService.getCategoryById(
      deprecationDto.categoryId,
    );
    deprecation.category = category;
    await this.deprecationRepo.save(deprecation);
    return deprecation;
  }

  async updateDeprecation(id: number, deprecationDto: DeprecationDto) {
    let toUpdate = await this.deprecationRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, deprecationDto);
    return await this.deprecationRepo.save(updated);
  }

  async deleteDeprecation(id: number) {
    return await this.deprecationRepo.delete({ id });
  }

  /*------------------------ cron ------------------------- */
  async getAllDeprecationsForCron() {
    const deprecations = await this.deprecationRepo.find({
      relations: { category: true },
    });
    return deprecations;
  }
}
