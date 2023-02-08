import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Cron } from '@nestjs/schedule';
import License from 'src/models/entities/license.entity';
import { LicenseRepository } from 'src/models/repositories/license.repository';
import { CategoryService } from '../category/category.service';
import { ManufacturerService } from '../manufacturer/manufacturer.service';
import { SupplierService } from '../supplier/supplier.service';
import { LicenseDto } from './dtos/license.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/notification.constants';

@Injectable()
export class LicenseService {
  private logger = new Logger(LicenseService.name);

  constructor(
    @InjectRepository(License)
    private licenseRepo: LicenseRepository,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService,
    private supplierService: SupplierService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
  ) {}

  async getAll() {
    const licenses = await this.licenseRepo.find({
      relations: {
        category: true,
        manufacturer: true,
        supplier: true,
      },
    });
    const res = licenses.map((license) => {
      const { category, manufacturer, supplier, ...rest } = license;
      return {
        ...rest,
        category: license?.category?.name,
        manufacturer: license?.manufacturer?.name,
        supplier: license?.supplier?.name,
      };
    });
    return res;
  }

  async getLicenseByLicenseId(id: number) {
    const license: License = await this.licenseRepo.findOne({
      where: { id },
      relations: {
        category: true,
        manufacturer: true,
        supplier: true,
      },
    });
    const { category, manufacturer, supplier, ...rest } = license;
    return {
      ...rest,
      category: license?.category?.name,
      manufacturer: license?.manufacturer?.name,
      supplier: license?.supplier?.name,
    };
  }

  async createNewLicense(licenseDto: LicenseDto) {
    const category = await this.categoryService.getCategoryById(
      licenseDto.supplierId,
    );
    const manufacturer = await this.manufacturerService.getManufacturerById(
      licenseDto.supplierId,
    );
    const supplier = await this.supplierService.getSupplierById(
      licenseDto.supplierId,
    );

    const license = new License();
    license.name = licenseDto.name;
    license.purchase_cost = licenseDto.purchase_cost;
    license.purchase_date = licenseDto.purchase_date;
    license.expiration_date = licenseDto.expiration_date;
    license.category = category;
    license.manufacturer = manufacturer;
    license.supplier = supplier;

    await this.licenseRepo.save(license);
    await this.handleCronLicenseExpiration();
    return license;
  }

  async updateLicense(id: number, licenseDto: LicenseDto) {
    let toUpdate = await this.licenseRepo.findOneBy({ id });
    let { categoryId, manufacturerId, supplierId, ...rest } = licenseDto;
    const category = await this.categoryService.getCategoryById(
      licenseDto.categoryId,
    );
    const manufacturer = await this.manufacturerService.getManufacturerById(
      licenseDto.manufacturerId,
    );
    const supplier = await this.supplierService.getSupplierById(
      licenseDto.supplierId,
    );
    let updated = Object.assign(toUpdate, rest);
    updated.category = category;
    updated.manufacturer = manufacturer;
    updated.supplier = supplier;
    await this.licenseRepo.save(updated);
    await this.handleCronLicenseExpiration();
    return updated;
  }

  async deleteLicense(id: number) {
    const deleted = await this.licenseRepo.delete({ id });
    await this.notificationService.deleteNotification(
      NotificationType.LICENSE,
      id,
    );
    return deleted;
  }

  async getLicenseById(id: number) {
    const license: License = await this.licenseRepo.findOneBy({ id });
    return license;
  }

  /*------------------------ cron ------------------------- */

  // At 00:00 everyday
  @Cron('0 0 * * *')
  async handleCronLicenseExpiration() {
    const licenses: License[] = await this.licenseRepo.find();
    await Promise.all(
      licenses.map(async (license: License) => {
        const expiration_date = license.expiration_date;
        const date1 = dayjs(expiration_date);
        const date2 = dayjs();
        let diff = date1.diff(date2, 'day');
        await this.notificationService.deleteNotification(
          NotificationType.LICENSE,
          license.id,
        );
        if (diff <= 30) {
          await this.notificationService.createNewNotification({
            itemId: license.id,
            expiration_date: license.expiration_date,
            type: NotificationType.LICENSE,
          });
        }
      }),
    );
  }
}
