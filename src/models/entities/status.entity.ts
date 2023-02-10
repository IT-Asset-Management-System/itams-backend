import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Asset from './asset.entity';
import AssetToInventory from './assetToInventory.entity';

@Entity()
export class Status extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @OneToMany(() => Asset, (asset) => asset.status)
  assets: Asset[];

  @OneToMany(
    () => AssetToInventory,
    (assetToInventory) => assetToInventory.new_status,
  )
  assetToInventories: AssetToInventory[];
}

export default Status;
