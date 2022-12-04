import { Repository } from 'typeorm';
import { GithubRepositoryEntity } from '../entities/githubRepository.entity';

export class GithubRepositoryRepository extends Repository<GithubRepositoryEntity> {}
