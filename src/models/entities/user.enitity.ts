import { Exclude } from 'class-transformer';
import { DEFAULT_AVATAR } from 'src/modules/users/user.constants';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import AssetToUser from './assetToUser.entity';

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

  @Column({
    default: null,
  })
  location: string;

  @Column({ default: null })
  phone: string;

  @OneToMany(() => AssetToUser, (assetToUser) => assetToUser.user)
  assetToUsers: AssetToUser[];

  // @Column('date')
  // @Column({
  //   default: null,
  // })
  // birthday: Date;
}

export default UserEntity;
