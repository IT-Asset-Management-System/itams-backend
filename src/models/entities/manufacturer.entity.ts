import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Asset from './asset.entity';
import AssetModel from './assetModel.entity';

@Entity()
export class Manufacturer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @OneToMany(() => AssetModel, (assetModel) => assetModel.manufacturer)
  assetModels: AssetModel[];
}

export default Manufacturer;
