import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import UserEntity from './user.enitity';

@Entity()
export class RequestAsset {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @Column({ default: 'requested' })
  status: string;

  @ManyToOne(() => Category, (category) => category.requestAssets)
  category: Category;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.requestAssets)
  user: UserEntity;
}
