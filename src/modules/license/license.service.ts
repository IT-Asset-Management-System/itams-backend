import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
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
import { LicenseQueryDto } from './dtos/licenseQuery.dto';
import { CheckoutLicenseDto } from './dtos/checkoutLicense.dto';
import { CheckinLicenseDto } from './dtos/checkinLicense.dto';
import LicenseToAsset from 'src/models/entities/licenseToAsset.entity';
import { AssetService } from '../asset/asset.service';
import { LicenseToAssetRepository } from 'src/models/repositories/licenseToAsset.repository';
import { LicenseToAssetQueryDto } from './dtos/licenseToAsset.dto';

@Injectable()
export class LicenseService {
  private logger = new Logger(LicenseService.name);

  constructor(
    @InjectRepository(License)
    private licenseRepo: LicenseRepository,
    @InjectRepository(LicenseToAsset)
    private licenseToAssetRepo: LicenseToAssetRepository,
    private assetService: AssetService,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService,
    private supplierService: SupplierService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
  ) {}

  async getAll(licenseQuery?: LicenseQueryDto) {
    const licenses = await this.licenseRepo.find({
      relations: {
        category: true,
        manufacturer: true,
        supplier: true,
        licenseToAssets: true,
      },
      where: {
        category: { id: licenseQuery.categoryId },
        manufacturer: { id: licenseQuery.manufacturerId },
        supplier: { id: licenseQuery.supplierId },
      },
    });
    const res = licenses.map((license) => {
      const { category, manufacturer, supplier, licenseToAssets, ...rest } =
        license;
      return {
        ...rest,
        category: license?.category?.name,
        manufacturer: license?.manufacturer?.name,
        supplier: license?.supplier?.name,
        available: license.seats - licenseToAssets?.length,
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
        licenseToAssets: true,
      },
    });
    const { category, manufacturer, supplier, licenseToAssets, ...rest } =
      license;
    return {
      ...rest,
      category: license?.category?.name,
      manufacturer: license?.manufacturer?.name,
      supplier: license?.supplier?.name,
      available: license.seats - licenseToAssets?.length,
    };
  }

  async getLicenseToAsset(licenseToAssetQueryDto?: LicenseToAssetQueryDto) {
    const licenseToAssets = await this.licenseToAssetRepo.find({
      relations: {
        asset: true,
        license: true,
      },
      where: {
        asset: { id: licenseToAssetQueryDto.assetId },
        license: { id: licenseToAssetQueryDto.licenseId },
      },
      withDeleted: licenseToAssetQueryDto.withDeleted,
    });
    const res = licenseToAssets.map((licenseToAsset) => {
      const { asset, license, ...rest } = licenseToAsset;
      return {
        ...rest,
        assetId: asset?.id,
        assetName: asset?.name,
        licenseId: license?.id,
        licenseName: license?.name,
      };
    });
    return res;
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
    license.key = licenseDto.key;
    license.purchase_cost = licenseDto.purchase_cost;
    license.purchase_date = licenseDto.purchase_date;
    license.expiration_date = licenseDto.expiration_date;
    license.seats = licenseDto.seats;
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

  /*------------------------ checkin/checkout license ------------------------- */

  async checkoutLicense(checkoutLicenseDto: CheckoutLicenseDto) {
    const license = await this.licenseRepo.findOne({
      relations: { licenseToAssets: true },
      where: { id: checkoutLicenseDto.licenseId },
    });
    if (license.licenseToAssets.length >= license.seats)
      throw new HttpException('This license is full', HttpStatus.BAD_REQUEST);
    if (
      await this.licenseToAssetRepo.findOne({
        where: {
          asset: { id: checkoutLicenseDto.assetId },
          license: { id: checkoutLicenseDto.licenseId },
        },
      })
    )
      throw new HttpException(
        'This asset is already checkout',
        HttpStatus.BAD_REQUEST,
      );
    const asset = await this.assetService.getAssetById(
      checkoutLicenseDto.assetId,
    );
    const licenseToAsset = new LicenseToAsset();
    licenseToAsset.asset = asset;
    licenseToAsset.license = license;
    licenseToAsset.checkout_date = checkoutLicenseDto.checkout_date;
    licenseToAsset.checkout_note = checkoutLicenseDto.checkout_note;
    await this.licenseToAssetRepo.save(licenseToAsset);
    return licenseToAsset;
  }

  async checkinLicense(checkinLicenseDto: CheckinLicenseDto) {
    const licenseToAsset = await this.licenseToAssetRepo.findOneBy({
      id: checkinLicenseDto.licenseToAssetId,
    });
    licenseToAsset.checkin_date = checkinLicenseDto.checkin_date;
    licenseToAsset.checkin_note = checkinLicenseDto.checkin_note;
    await this.licenseToAssetRepo.save(licenseToAsset);
    await this.licenseToAssetRepo.softDelete({
      id: checkinLicenseDto.licenseToAssetId,
    });
    return licenseToAsset;
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
