import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import AssetModel from './assetModel.entity';
import Department from './department.entity';
import Status from './status.entity';
import Supplier from './supplier.entity';

@Entity()
export class Asset extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  purchase_cost: number;

  @Column({ default: null })
  current_cost: number;

  @Column({ default: null })
  purchase_date: Date;

  @Column({ default: null })
  userId: number;

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
