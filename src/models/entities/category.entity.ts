import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Asset from './asset.entity';
import AssetModel from './assetModel.entity';
import { RequestAsset } from './requestAssest.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @OneToMany(() => AssetModel, (assetModel) => assetModel.category)
  assetModels: AssetModel[];
}
