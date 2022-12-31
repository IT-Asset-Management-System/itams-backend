import { Exclude } from 'class-transformer';
import { DEFAULT_AVATAR } from 'src/modules/users/user.constants';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';

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

  // @Column('date')
  // @Column({
  //   default: null,
  // })
  // birthday: Date;
}

export default UserEntity;
