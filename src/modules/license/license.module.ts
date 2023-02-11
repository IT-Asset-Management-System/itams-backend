import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import License from 'src/models/entities/license.entity';
import { LicenseRepository } from 'src/models/repositories/license.repository';
import { CategoryModule } from '../category/category.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';
import { NotificationModule } from '../notification/notification.module';
import { SupplierModule } from '../supplier/supplier.module';
import { LicenseController } from './license.controller';
import { LicenseService } from './license.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([License]),
    CategoryModule,
    ManufacturerModule,
    SupplierModule,
    forwardRef(() => NotificationModule),
  ],
  controllers: [LicenseController],
  providers: [LicenseService, LicenseRepository],
  exports: [LicenseService],
})
export class LicenseModule {}
