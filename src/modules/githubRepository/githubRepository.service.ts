import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Octokit } from 'octokit';
import { GithubRepositoryEntity } from 'src/model/entities/githubRepository.entity';
import { GithubRepositoryRepository } from 'src/model/repositories/githubRepository.repository';

@Injectable()
export class GithubRepositoryService {
  constructor(
    @InjectRepository(GithubRepositoryEntity)
    private githubRepo: GithubRepositoryRepository,
  ) {}

  private octokit = new Octokit({
    auth: process.env.ACCESS_TOKEN,
  });

  async listOrganizationRepos(name: string) {
    const repos = await this.octokit.request('GET /orgs/{org}/repos', {
      org: name,
    });
    if (repos) {
      return repos.data;
    }
    throw new HttpException(
      'Found no repos with this organization name',
      HttpStatus.NOT_FOUND,
    );
  }

  async getRepo(owner: string, repo: string) {
    const repos = await this.octokit.request('GET /repos/{owner}/{repo}', {
      owner,
      repo,
    });
    if (repos) {
      return repos;
    }
    throw new HttpException(
      'Found no repos with this organization name',
      HttpStatus.NOT_FOUND,
    );
  }
}
