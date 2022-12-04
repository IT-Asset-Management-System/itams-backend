import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class GithubRepositoryEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  visibility: string;

  @Column()
  created_at: string;

  @Column()
  updated_at: string;

  @Column()
  html_url: string;
}
