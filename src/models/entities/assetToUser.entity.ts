import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';
import Asset from './asset.entity';
import UserEntity from './user.enitity';

@Entity()
export class AssetToUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  checkout_date: Date;

  @Column({ default: null })
  checkin_date: Date;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.assetToUsers)
  user: UserEntity;

  @ManyToOne(() => Asset, (asset) => asset.assetToUsers)
  asset: Asset;

  @DeleteDateColumn()
  deletedAt: Date;
}

export default AssetToUser;
