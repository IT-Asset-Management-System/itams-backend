import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Asset from './asset.entity';
import AssetModel from './assetModel.entity';
import License from './license.entity';
import { RequestAsset } from './requestAssest.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  image: string;

  @OneToMany(() => AssetModel, (assetModel) => assetModel.category)
  assetModels: AssetModel[];

  @OneToMany(() => License, (license) => license.category)
  licenses: License[];

  @OneToMany(() => RequestAsset, (requestAsset) => requestAsset.category)
  requestAssets: RequestAsset[];
}
