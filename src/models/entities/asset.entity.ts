import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import Manufacturer from './manufacturer.entity';
import Supplier from './supplier.entity';

@Entity()
export class Asset extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  status: string;

  @Column({ default: null })
  purchase_cost: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.assets)
  supplier: Supplier;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.assets)
  manufacturer: Manufacturer;

  @ManyToOne(() => Category, (category) => category.assets)
  category: Category;
}

export default Asset;
