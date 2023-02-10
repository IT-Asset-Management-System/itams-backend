import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Asset from './asset.entity';
import { Category } from './category.entity';
import Manufacturer from './manufacturer.entity';
import { RequestAsset } from './requestAssest.entity';

@Entity()
export class AssetModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @OneToMany(() => Asset, (asset) => asset.assetModel)
  assets: Asset[];

  @OneToMany(() => RequestAsset, (requestAsset) => requestAsset.assetModel)
  requestAssets: RequestAsset[];

  @ManyToOne(() => Category, (category) => category.assetModels)
  category: Category;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.assetModels)
  manufacturer: Manufacturer;
}

export default AssetModel;
