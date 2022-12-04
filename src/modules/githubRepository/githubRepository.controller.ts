import { Controller, Param, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GithubRepositoryService } from './githubRepository.service';

@ApiTags('repos')
@Controller('repos')
export class GithubRepositoryController {
  constructor(private githubRepositoryService: GithubRepositoryService) {}

  @Get('orgs/:org')
  async listOrganizationRepos(@Param('org') org: string) {
    return await this.githubRepositoryService.listOrganizationRepos(org);
  }

  @Get(':owner/:repo')
  async getRepo(@Param('owner') owner: string, @Param('repo') repo: string) {
    return await this.githubRepositoryService.getRepo(owner, repo);
  }
}
