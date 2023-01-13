import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Asset from './asset.entity';
import { RequestAsset } from './requestAssest.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @OneToMany(() => Asset, (asset) => asset.category)
  assets: Asset[];

  @OneToMany(() => RequestAsset, (requestAsset) => requestAsset.category)
  requestAssets: RequestAsset[];
}
