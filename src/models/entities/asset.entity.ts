import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AssetMaintenance } from './assetMaintenance.entity';
import AssetModel from './assetModel.entity';
import AssetToInventory from './assetToInventory.entity';
import AssetToUser from './assetToUser.entity';
import Department from './department.entity';
import Inventory from './inventory.entity';
import Status from './status.entity';
import Supplier from './supplier.entity';

@Entity()
export class Asset extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  image: string;

  @Column({ default: null })
  purchase_cost: number;

  @Column({ default: null })
  current_cost: number;

  @Column({ default: null })
  purchase_date: Date;

  @OneToMany(() => AssetToUser, (assetToUser) => assetToUser.asset)
  assetToUsers: AssetToUser[];

  @OneToMany(
    () => AssetToInventory,
    (assetToInventory) => assetToInventory.asset,
  )
  assetToInventories: AssetToInventory[];

  @OneToMany(
    () => AssetMaintenance,
    (assetMaintenance) => assetMaintenance.asset,
  )
  assetMaintenances: AssetMaintenance[];

  @ManyToOne(() => AssetModel, (assetModel) => assetModel.assets)
  assetModel: AssetModel;

  @ManyToOne(() => Department, (department) => department.assets)
  department: Department;

  @ManyToOne(() => Status, (status) => status.assets)
  status: Status;

  @ManyToOne(() => Supplier, (supplier) => supplier.assets)
  supplier: Supplier;
}

export default Asset;
