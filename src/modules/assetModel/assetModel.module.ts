import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AssetModel from 'src/models/entities/assetModel.entity';
import { AssetModelRepository } from 'src/models/repositories/assetModel.repository';
import { AssetModelController } from './assetModel.controller';
import { AssetModelService } from './assetModel.service';

@Module({
  imports: [TypeOrmModule.forFeature([AssetModel])],
  controllers: [AssetModelController],
  providers: [AssetModelService, AssetModelRepository],
  exports: [AssetModelService],
})
export class AssetModelModule {}
