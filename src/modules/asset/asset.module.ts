import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Asset from 'src/models/entities/asset.entity';
import AssetToUser from 'src/models/entities/assetToUser.entity';
import { RequestAsset } from 'src/models/entities/requestAssest.entity';
import { AssetRepository } from 'src/models/repositories/asset.repository';
import { AssetToUserRepository } from 'src/models/repositories/assetToUser.repository';
import { CategoryModule } from '../category/categories.module';
import { UsersModule } from '../users/users.module';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, AssetToUser, RequestAsset]),
    UsersModule,
    CategoryModule,
  ],
  controllers: [AssetController],
  providers: [
    AssetService,
    AssetRepository,
    AssetToUserRepository,
    RequestAsset,
  ],
  exports: [AssetService],
})
export class AssetModule {}
