import { IsBoolean } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class DigitalContent extends BaseEntity {
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
}

export default DigitalContent;
