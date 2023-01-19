import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { ManufacturerService } from './manufacturer.service';

@ApiTags('manufacturer')
@Controller('manufacturer')
export class ManufacturerController {
  constructor(private manufacturerService: ManufacturerService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllManufacturers() {
    return await this.manufacturerService.getAllManufacturers();
  }
}
