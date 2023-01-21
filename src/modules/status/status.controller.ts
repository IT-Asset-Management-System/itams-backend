import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { StatusService } from './status.service';

@ApiTags('status')
@Controller('status')
export class StatusController {
  constructor(private statusService: StatusService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllStatuses() {
    return await this.statusService.getAllStatuses();
  }
}
