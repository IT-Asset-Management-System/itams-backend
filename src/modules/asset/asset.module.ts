import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Asset from 'src/models/entities/asset.entity';
import AssetToUser from 'src/models/entities/assetToUser.entity';
import { AssetRepository } from 'src/models/repositories/asset.repository';
import { AssetToUserRepository } from 'src/models/repositories/assetToUser.repository';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, AssetToUser])],
  controllers: [AssetController],
  providers: [AssetService, AssetRepository, AssetToUserRepository],
  exports: [AssetService],
})
export class AssetModule {}
