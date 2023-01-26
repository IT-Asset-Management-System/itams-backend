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
import { AssetModelService } from '../assetModel/assetModel.service';
import { DepartmentService } from '../department/department.service';
import { StatusService } from '../status/status.service';
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
    private assetModelService: AssetModelService,
    private departmentService: DepartmentService,
    private statusService: StatusService,
    private supplierService: SupplierService,
  ) {}

  async getAll() {
    const assets = await this.assetRepo.find({
      relations: {
        assetModel: true,
        department: true,
        status: true,
        supplier: true,
      },
    });
    const res = assets.map((asset) => {
      const { assetModel, department, status, supplier, ...rest } = asset;
      return {
        ...rest,
        assetModel: asset?.assetModel?.name,
        department: asset?.department?.name,
        status: asset?.status?.name,
        supplier: asset?.supplier?.name,
      };
    });
    return res;
  }

  async getAssetById(id: number) {
    const asset: Asset = await this.assetRepo.findOne({
      where: { id },
      relations: {
        assetModel: true,
        department: true,
        status: true,
        supplier: true,
      },
    });
    const { assetModel, department, status, supplier, ...rest } = asset;
    return {
      ...rest,
      assetModel: asset?.assetModel?.name,
      department: asset?.department?.name,
      status: asset?.status?.name,
      supplier: asset?.supplier?.name,
    };
  }

  async createNewAsset(assetDto: AssetDto) {
    const assetModel = await this.assetModelService.getAssetModelById(
      assetDto.assetModelId,
    );
    const department = await this.departmentService.getDepartmentById(
      assetDto.departmentId,
    );
    const status = await this.statusService.getStatusById(assetDto.statusId);
    const supplier = await this.supplierService.getSupplierById(
      assetDto.supplierId,
    );

    const asset = new Asset();
    asset.name = assetDto.name;
    asset.purchase_cost = assetDto.purchase_cost;
    asset.assetModel = assetModel;
    asset.department = department;
    asset.status = status;
    asset.supplier = supplier;

    await this.assetRepo.save(asset);
    return asset;
  }

  async updateAsset(id: number, assetDto: AssetDto) {
    let toUpdate = await this.assetRepo.findOneBy({ id });
    let { assetModelId, departmentId, statusId, supplierId, ...rest } =
      assetDto;
    const assetModel = await this.assetModelService.getAssetModelById(
      assetDto.assetModelId,
    );
    const department = await this.departmentService.getDepartmentById(
      assetDto.departmentId,
    );
    const status = await this.statusService.getStatusById(assetDto.statusId);
    const supplier = await this.supplierService.getSupplierById(
      assetDto.supplierId,
    );
    let updated = Object.assign(toUpdate, rest);
    updated.assetModel = assetModel;
    updated.department = department;
    updated.status = status;
    updated.supplier = supplier;
    return await this.assetRepo.save(updated);
  }

  async deleteAsset(id: number) {
    return await this.assetRepo.delete({ id });
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
          relations: {
            assetModel: true,
            department: true,
            status: true,
            supplier: true,
          },
        });
        return {
          ...assetToUser.asset,
          assetModel: asset?.assetModel?.name,
          department: asset?.department?.name,
          status: asset?.status?.name,
          supplier: asset?.supplier?.name,
        };
      }),
    );
    return res;
  }

  async getAssetRequestedByUser(id: number) {
    const requestAsset = await this.requestAssetRepo.find({
      where: { user: { id } },
      relations: { assetModel: true },
    });
    const res = requestAsset.map((r: RequestAsset) => {
      const { assetModel, ...rest } = r;
      return { ...rest, assetModel: assetModel.name };
    });
    return res;
  }

  async createNewRequestAsset(userId: number, categoryId: number) {
    const newRequestAsset = new RequestAsset();

    const user = await this.userService.getUserById(userId);
    // user.requestAssets.push(newRequestAsset);
    // await this.userService.saveUser(user);

    const assetModel = await this.assetModelService.getAssetModelById(
      categoryId,
    );
    // category.requestAssets.push(newRequestAsset);
    // await this.categoryService.saveCategory(category);
    if (!assetModel)
      throw new HttpException('Category not exist', HttpStatus.BAD_REQUEST);
    newRequestAsset.user = user;
    newRequestAsset.assetModel = assetModel;
    await this.requestAssetRepo.save(newRequestAsset);
    return newRequestAsset;
  }
}
