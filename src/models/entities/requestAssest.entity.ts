import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import AssetModel from './assetModel.entity';
import UserEntity from './user.enitity';

@Entity()
export class RequestAsset {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @Column({ default: 'requested' })
  status: string;

  @ManyToOne(() => AssetModel, (assetModel) => assetModel.requestAssets)
  assetModel: AssetModel;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.requestAssets)
  user: UserEntity;
}
