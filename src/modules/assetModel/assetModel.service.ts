import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import AssetModel from 'src/models/entities/assetModel.entity';
import { AssetModelRepository } from 'src/models/repositories/assetModel.repository';
import { CategoryService } from '../category/category.service';
import { ManufacturerService } from '../manufacturer/manufacturer.service';
import { AssetModelDto } from './dtos/assetModel.dto';

@Injectable()
export class AssetModelService {
  private logger = new Logger(AssetModelService.name);

  constructor(
    @InjectRepository(AssetModel) private assetModelRepo: AssetModelRepository,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService,
  ) {}

  async getAllAssetModels() {
    const assetModels = await this.assetModelRepo.find({
      relations: { assets: true, category: true, manufacturer: true },
    });
    const res = assetModels.map((assetModel) => {
      const { assets, category, manufacturer, ...rest } = assetModel;
      return {
        ...rest,
        numOfAssets: assets.length,
        category: category?.name,
        manufacturer: manufacturer?.name,
      };
    });
    return res;
  }

  async getAssetModelById(id: number) {
    const assetModel = await this.assetModelRepo.findOneBy({ id });
    return assetModel;
  }

  async createNewAssetModel(assetModelDto: AssetModelDto) {
    const category = await this.categoryService.getCategoryById(
      assetModelDto.categoryId,
    );
    const manufacturer = await this.manufacturerService.getManufacturerById(
      assetModelDto.manufacturerId,
    );

    const assetModel = new AssetModel();
    assetModel.name = assetModelDto.name;
    assetModel.category = category;
    assetModel.manufacturer = manufacturer;

    await this.assetModelRepo.save(assetModel);
    return assetModel;
  }

  async updateAssetModel(id: number, assetModelDto: AssetModelDto) {
    let toUpdate = await this.assetModelRepo.findOneBy({ id });
    let { categoryId, manufacturerId, ...rest } = assetModelDto;
    const category = await this.categoryService.getCategoryById(
      assetModelDto.categoryId,
    );
    const manufacturer = await this.manufacturerService.getManufacturerById(
      assetModelDto.manufacturerId,
    );
    let updated = Object.assign(toUpdate, rest);
    updated.category = category;
    updated.manufacturer = manufacturer;
    return await this.assetModelRepo.save(updated);
  }

  async deleteAssetModel(id: number) {
    return await this.assetModelRepo.delete({ id });
  }

  /*------------------------ cron ------------------------- */
  async getAllAssetModelsByCategory(categoryId: number) {
    const assetModels: AssetModel[] = await this.assetModelRepo.find({
      where: { category: { id: categoryId } },
      relations: { assets: true, category: true, manufacturer: true },
    });
    return assetModels;
  }
}
