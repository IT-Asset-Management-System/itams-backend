import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubRepositoryEntity } from 'src/model/entities/githubRepository.entity';
import { GithubRepositoryRepository } from 'src/model/repositories/githubRepository.repository';
import { GithubRepositoryController } from './githubRepository.controller';
import { GithubRepositoryService } from './githubRepository.service';

@Module({
  imports: [TypeOrmModule.forFeature([GithubRepositoryEntity])],
  exports: [GithubRepositoryService],
  controllers: [GithubRepositoryController],
  providers: [GithubRepositoryService, GithubRepositoryRepository],
})
export class GithubRepositoryModule {}
