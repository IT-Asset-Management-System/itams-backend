import { Exclude } from 'class-transformer';
import { DEFAULT_AVATAR } from 'src/modules/users/user.constants';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import AssetToUser from './assetToUser.entity';
import Department from './department.entity';
import Location from './location.entity';
import { RequestAsset } from './requestAssest.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: null,
  })
  name: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column({})
  @Exclude()
  password: string;

  @Column({
    default: DEFAULT_AVATAR,
  })
  avatar: string;

  @ManyToOne(() => Department, (department) => department.users)
  department: Department;

  @Column({ default: null })
  phone: string;

  @OneToMany(() => AssetToUser, (assetToUser) => assetToUser.user)
  assetToUsers: AssetToUser[];

  @OneToMany(() => RequestAsset, (requestAsset) => requestAsset.user)
  requestAssets: RequestAsset[];

  // @Column('date')
  // @Column({
  //   default: null,
  // })
  // birthday: Date;
}

export default UserEntity;
