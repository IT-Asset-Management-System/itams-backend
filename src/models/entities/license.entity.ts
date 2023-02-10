import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import Manufacturer from './manufacturer.entity';
import Supplier from './supplier.entity';

@Entity()
export class License extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  purchase_cost: number;

  @Column({ default: null })
  purchase_date: Date;

  @Column({ default: null })
  expiration_date: Date;

  @ManyToOne(() => Category, (category) => category.licenses)
  category: Category;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.licenses)
  manufacturer: Manufacturer;

  @ManyToOne(() => Supplier, (supplier) => supplier.licenses)
  supplier: Supplier;
}

export default License;
