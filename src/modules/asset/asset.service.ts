import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import Asset from 'src/models/entities/asset.entity';
import AssetModel from 'src/models/entities/assetModel.entity';
import AssetToUser from 'src/models/entities/assetToUser.entity';
import { Category } from 'src/models/entities/category.entity';
import Deprecation from 'src/models/entities/deprecation.entity';
import { RequestAsset } from 'src/models/entities/requestAssest.entity';
import { AssetRepository } from 'src/models/repositories/asset.repository';
import { AssetToUserRepository } from 'src/models/repositories/assetToUser.repository';
import { RequestAssetRepository } from 'src/models/repositories/requestAsset.repository';
import { IsNull } from 'typeorm';
import { AssetModelService } from '../assetModel/assetModel.service';
import { CategoryService } from '../category/category.service';
import { DepartmentService } from '../department/department.service';
import { DeprecationService } from '../deprecation/deprecation.service';
import { StatusService } from '../status/status.service';
import { SupplierService } from '../supplier/supplier.service';
import { UsersService } from '../users/users.service';
import { RequestAssetStatus } from './asset.constants';
import { AssetDto } from './dtos/asset.dto';
import { AssetQueryDto } from './dtos/assetQuery.dto';

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
    private categoryService: CategoryService,
    private deprecationService: DeprecationService,
  ) {}

  async getAll(assetQuery?: AssetQueryDto) {
    const assets = await this.assetRepo.find({
      relations: {
        assetModel: true,
        department: true,
        status: true,
        supplier: true,
      },
      where: {
        assetModel: { id: assetQuery.assetModelId },
        department: { id: assetQuery.departmentId },
        status: { id: assetQuery.statusId },
        supplier: { id: assetQuery.supplierId },
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

  async getAssetByAssetId(id: number) {
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

  async getAssetById(id: number) {
    const asset: Asset = await this.assetRepo.findOneBy({ id });
    return asset;
  }

  async getAssetsByModel(assetModelId: number) {
    const asset: Asset[] = await this.assetRepo.find({
      where: { assetModel: { id: assetModelId }, userId: IsNull() },
    });
    return asset;
  }

  async getAllRequestAssets() {
    const requestAsset = await this.requestAssetRepo.find({
      relations: { assetModel: true, user: true },
    });
    const res = requestAsset.map((r: RequestAsset) => {
      const { assetModel, user, ...rest } = r;
      return {
        ...rest,
        assetModel: assetModel.name,
        name: user.name,
        username: user.username,
      };
    });
    return res;
  }

  async acceptRequest(id: number, assetId: number) {
    const request = await this.requestAssetRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    if (request.status !== RequestAssetStatus.REQUESTED)
      throw new HttpException(
        'This request was accepted/rejected',
        HttpStatus.BAD_REQUEST,
      );
    if (
      await this.assetToUserRepo.findOne({ where: { asset: { id: assetId } } })
    )
      throw new HttpException('This asset is in use', HttpStatus.BAD_REQUEST);
    request.status = RequestAssetStatus.ACCEPTED;
    request.assetId = assetId;
    await this.requestAssetRepo.save(request);
    const assetToUser = new AssetToUser();
    const user = await this.userService.getUserById(request.user.id);
    const asset = await this.getAssetById(assetId);
    assetToUser.user = user;
    assetToUser.asset = asset;
    asset.userId = request.user.id;
    await this.assetRepo.save(asset);
    await this.assetToUserRepo.save(assetToUser);
    return request;
  }

  async rejectRequest(id: number) {
    const request = await this.requestAssetRepo.findOneBy({ id });
    if (request.status !== RequestAssetStatus.REQUESTED)
      throw new HttpException(
        'This request was accepted/rejected',
        HttpStatus.BAD_REQUEST,
      );
    request.status = RequestAssetStatus.REJECTED;
    await this.requestAssetRepo.save(request);
    return request;
  }

  /*------------------------ cron ------------------------- */

  // At 00:00 every Sunday
  @Cron('0 0 * * 0')
  async handleCronAssetDeprecation() {
    const deprecations: Deprecation[] =
      await this.deprecationService.getAllDeprecationsForCron();
    await Promise.all(
      deprecations.map(async (deprecation: Deprecation) => {
        const category: Category = deprecation.category;
        const assetModels: AssetModel[] =
          await this.assetModelService.getAllAssetModelsByCategory(category.id);
        await Promise.all(
          assetModels.map(async (assetModel: AssetModel) => {
            const assets: Asset[] = assetModel.assets;
            await Promise.all(
              assets.map(async (asset: Asset) => {
                const months = deprecation.months;
                const purchase_date = asset.purchase_date;
                const date1 = dayjs(purchase_date);
                const date2 = dayjs();
                let diff = date2.diff(date1, 'month');
                asset.current_cost = Math.round(
                  (asset.purchase_cost / months) * (months - diff),
                );
                await this.assetRepo.save(asset);
              }),
            );
          }),
        );
      }),
    );
  }

  /*------------------------ user ------------------------- */

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
