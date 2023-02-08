import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import Asset from './asset.entity';
import UserEntity from './user.enitity';

@Entity()
export class AssetToUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.assetToUsers)
  user: UserEntity;

  @OneToOne(() => Asset)
  @JoinColumn()
  asset: Asset;
}

export default AssetToUser;
