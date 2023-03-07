import { IsBoolean } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import SourceCodeToUser from './sourceCodeToUser.entity';

@Entity()
export class SourceCode extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: null,
  })
  name: string;

  @Column({
    default: null,
  })
  owner: string;

  @Column({
    default: null,
  })
  description: string;

  @Column({
    default: false,
  })
  @IsBoolean()
  isPrivate: boolean;

  @Column({
    default: null,
  })
  url: string;

  @OneToMany(
    () => SourceCodeToUser,
    (sourceCodeToUser) => sourceCodeToUser.sourceCode,
  )
  sourceCodeToUsers: SourceCodeToUser[];
}

export default SourceCode;
