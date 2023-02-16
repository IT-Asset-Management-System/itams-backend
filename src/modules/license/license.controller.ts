import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Put,
  Body,
  ParseIntPipe,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { LicenseDto } from './dtos/license.dto';
import { LicenseQueryDto } from './dtos/licenseQuery.dto';
import { LicenseService } from './license.service';

@ApiTags('license')
@Controller('license')
export class LicenseController {
  constructor(private licenseService: LicenseService) {}

  @Get('all-licenses')
  @UseGuards(JwtAdminAuthGuard)
  async getAllLicenses(@Query() licenseQuery: LicenseQueryDto) {
    return await this.licenseService.getAll(licenseQuery);
  }

  @Get('get-license-by-id')
  @UseGuards(JwtAdminAuthGuard)
  async getLicenseById(@Body('id', ParseIntPipe) id: number) {
    return await this.licenseService.getLicenseByLicenseId(id);
  }

  @Post('create-license')
  @UseGuards(JwtAdminAuthGuard)
  async createLicense(@Body() licenseDto: LicenseDto) {
    return await this.licenseService.createNewLicense(licenseDto);
  }

  @Put('update-license')
  @UseGuards(JwtAdminAuthGuard)
  async updateLicense(
    @Body() licenseDto: LicenseDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.licenseService.updateLicense(id, licenseDto);
  }

  @Delete('delete-license')
  @UseGuards(JwtAdminAuthGuard)
  async deleteLicense(@Body('id', ParseIntPipe) id: number) {
    return await this.licenseService.deleteLicense(id);
  }
}
