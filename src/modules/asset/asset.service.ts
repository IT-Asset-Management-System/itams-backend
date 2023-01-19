import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Asset from 'src/models/entities/asset.entity';
import AssetToUser from 'src/models/entities/assetToUser.entity';
import { RequestAsset } from 'src/models/entities/requestAssest.entity';
import { AssetRepository } from 'src/models/repositories/asset.repository';
import { AssetToUserRepository } from 'src/models/repositories/assetToUser.repository';
import { RequestAssetRepository } from 'src/models/repositories/requestAsset.repository';
import { CategoryService } from '../category/category.service';
import { ManufacturerService } from '../manufacturer/manufacturer.service';
import { SupplierService } from '../supplier/supplier.service';
import { UsersService } from '../users/users.service';
import { AssetDto } from './dtos/asset.dto';

@Injectable()
export class AssetService {
  private logger = new Logger(AssetService.name);

  constructor(
    @InjectRepository(Asset)
    private assetRepo: AssetRepository,
    @InjectRepository(AssetToUser)
    private assetToUserRepo: AssetToUserRepository,
    @InjectRepository(RequestAsset)
    private requestAssetRepo: RequestAssetRepository,
    private userService: UsersService,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService,
    private supplierService: SupplierService,
  ) {}

  async getAll() {
    const assets = await this.assetRepo.find({
      relations: { supplier: true, manufacturer: true, category: true },
    });
    const res = assets.map((asset) => {
      const { category, manufacturer, supplier, ...rest } = asset;
      return {
        ...rest,
        category: asset?.category?.name,
        supplier: asset?.supplier?.name,
        manufacturer: asset?.manufacturer?.name,
      };
    });
    return res;
  }

  async getAssetById(id: number) {
    const asset: Asset = await this.assetRepo.findOne({
      where: { id },
      relations: { supplier: true, manufacturer: true, category: true },
    });
    const { category, manufacturer, supplier, ...rest } = asset;
    return {
      ...rest,
      category: asset?.category?.name,
      supplier: asset?.supplier?.name,
      manufacturer: asset?.manufacturer?.name,
    };
  }

  async createNewAsset(assetDto: AssetDto) {
    const category = await this.categoryService.getCategoryById(
      assetDto.categoryId,
    );
    const manufacturer = await this.manufacturerService.getManufacturerById(
      assetDto.manufacturerId,
    );
    const supplier = await this.supplierService.getSupplierById(
      assetDto.supplierId,
    );

    const asset = new Asset();
    asset.name = assetDto.name;
    asset.status = assetDto.status;
    asset.purchase_cost = assetDto.purchase_cost;
    asset.category = category;
    asset.manufacturer = manufacturer;
    asset.supplier = supplier;

    await this.assetRepo.save(asset);
    return asset;
  }

  async updateAsset(id: number, assetDto: AssetDto) {
    let toUpdate = await this.assetRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, assetDto);
    return await this.assetRepo.save(updated);
  }

  async deleteAsset(id: number) {
    return await this.assetRepo.delete({id});
  }

  async getAssetToUser(userId: number) {
    const assetToUsers = await this.assetToUserRepo.find({
      where: { user: { id: userId } },
      relations: { asset: true, user: true },
    });
    const res = await Promise.all(
      assetToUsers.map(async (assetToUser) => {
        const assetId = assetToUser.asset.id;
        const asset = await this.assetRepo.findOne({
          where: {
            id: assetId,
          },
          relations: { category: true, manufacturer: true, supplier: true },
        });
        return {
          ...assetToUser.asset,
          category: asset.category.name,
          manufacturer: asset.manufacturer.name,
          supplier: asset.supplier.name,
        };
      }),
    );
    return res;
  }

  async getAssetRequestedByUser(id: number) {
    const requestAsset = await this.requestAssetRepo.find({
      where: { user: { id } },
      relations: { category: true },
    });
    const res = requestAsset.map((r: RequestAsset) => {
      const { category, ...rest } = r;
      return { ...rest, category: category.name };
    });
    return res;
  }

  async createNewRequestAsset(userId: number, categoryId: number) {
    const newRequestAsset = new RequestAsset();

    const user = await this.userService.getUserById(userId);
    // user.requestAssets.push(newRequestAsset);
    // await this.userService.saveUser(user);

    const category = await this.categoryService.getCategoryById(categoryId);
    // category.requestAssets.push(newRequestAsset);
    // await this.categoryService.saveCategory(category);
    if (!category)
      throw new HttpException('Category not exist', HttpStatus.BAD_REQUEST);
    newRequestAsset.user = user;
    newRequestAsset.category = category;
    await this.requestAssetRepo.save(newRequestAsset);
    return newRequestAsset;
  }
}
