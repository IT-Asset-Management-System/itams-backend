import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Asset from './asset.entity';
import AssetModel from './assetModel.entity';
import License from './license.entity';

@Entity()
export class Manufacturer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @OneToMany(() => AssetModel, (assetModel) => assetModel.manufacturer)
  assetModels: AssetModel[];

  @OneToMany(() => License, (license) => license.manufacturer)
  licenses: License[];
}

export default Manufacturer;
