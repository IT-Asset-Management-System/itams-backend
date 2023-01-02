import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Asset from 'src/models/entities/asset.entity';
import AssetToUser from 'src/models/entities/assetToUser.entity';
import { AssetRepository } from 'src/models/repositories/asset.repository';
import { AssetToUserRepository } from 'src/models/repositories/assetToUser.repository';

@Injectable()
export class AssetService {
  private logger = new Logger(AssetService.name);

  constructor(
    @InjectRepository(Asset)
    private assetRepo: AssetRepository,
    @InjectRepository(AssetToUser)
    private assetToUserRepo: AssetToUserRepository,
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
    console.log(res);
    return res;
  }
}
