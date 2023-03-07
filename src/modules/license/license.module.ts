import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import License from 'src/models/entities/license.entity';
import LicenseToAsset from 'src/models/entities/licenseToAsset.entity';
import { LicenseRepository } from 'src/models/repositories/license.repository';
import { LicenseToAssetRepository } from 'src/models/repositories/licenseToAsset.repository';
import { AssetModule } from '../asset/asset.module';
import { CategoryModule } from '../category/category.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';
import { NotificationModule } from '../notification/notification.module';
import { SupplierModule } from '../supplier/supplier.module';
import { LicenseController } from './license.controller';
import { LicenseService } from './license.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([License, LicenseToAsset]),
    forwardRef(() => AssetModule),
    CategoryModule,
    ManufacturerModule,
    SupplierModule,
    forwardRef(() => NotificationModule),
  ],
  controllers: [LicenseController],
  providers: [LicenseService, LicenseRepository, LicenseToAssetRepository],
  exports: [LicenseService],
})
export class LicenseModule {}
