import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Asset from 'src/models/entities/asset.entity';
import AssetToUser from 'src/models/entities/assetToUser.entity';
import { RequestAsset } from 'src/models/entities/requestAssest.entity';
import { AssetRepository } from 'src/models/repositories/asset.repository';
import { AssetToUserRepository } from 'src/models/repositories/assetToUser.repository';
import { RequestAssetRepository } from 'src/models/repositories/requestAsset.repository';
import { CategoryService } from '../category/category.service';
import { UsersService } from '../users/users.service';

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
  ) {}

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
