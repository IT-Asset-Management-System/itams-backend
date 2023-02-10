import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AssetToInventory from 'src/models/entities/assetToInventory.entity';
import Inventory from 'src/models/entities/inventory.entity';
import { AssetToInventoryRepository } from 'src/models/repositories/assetToInventory.repository';
import { InventoryRepository } from 'src/models/repositories/inventory.repository';
import { AssetModule } from '../asset/asset.module';
import { DepartmentModule } from '../department/department.module';
import { StatusModule } from '../status/status.module';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, AssetToInventory]),
    DepartmentModule,
    AssetModule,
    StatusModule,
  ],
  controllers: [InventoryController],
  providers: [
    InventoryService,
    InventoryRepository,
    AssetToInventoryRepository,
  ],
  exports: [InventoryService],
})
export class InventoryModule {}
