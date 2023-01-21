import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import AssetModel from 'src/models/entities/assetModel.entity';
import { AssetModelRepository } from 'src/models/repositories/assetModel.repository';

@Injectable()
export class AssetModelService {
  private logger = new Logger(AssetModelService.name);

  constructor(
    @InjectRepository(AssetModel) private assetModelRepo: AssetModelRepository,
  ) {}

  async getAllAssetModels() {
    const assetModels = await this.assetModelRepo.find();
    return assetModels;
  }

  async getAssetModelById(id: number) {
    const assetModel = await this.assetModelRepo.findOneBy({ id });
    return assetModel;
  }
}
