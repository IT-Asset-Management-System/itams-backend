import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import License from 'src/models/entities/license.entity';
import { LicenseRepository } from 'src/models/repositories/license.repository';
import { CategoryService } from '../category/category.service';
import { ManufacturerService } from '../manufacturer/manufacturer.service';
import { SupplierService } from '../supplier/supplier.service';
import { LicenseDto } from './dtos/license.dto';

@Injectable()
export class LicenseService {
  private logger = new Logger(LicenseService.name);

  constructor(
    @InjectRepository(License)
    private licenseRepo: LicenseRepository,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService,
    private supplierService: SupplierService,
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

  async getLicenseById(id: number) {
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
    return license;
  }

  async updateLicense(id: number, licenseDto: LicenseDto) {
    let toUpdate = await this.licenseRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, licenseDto);
    return await this.licenseRepo.save(updated);
  }

  async deleteLicense(id: number) {
    return await this.licenseRepo.delete({ id });
  }
}
