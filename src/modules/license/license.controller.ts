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
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { CheckinLicenseDto } from './dtos/checkinLicense.dto';
import { CheckoutLicenseDto } from './dtos/checkoutLicense.dto';
import { LicenseDto } from './dtos/license.dto';
import { LicenseQueryDto } from './dtos/licenseQuery.dto';
import { LicenseToAssetQueryDto } from './dtos/licenseToAsset.dto';
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

  @Get('get-license-by-id/:id')
  @UseGuards(JwtAdminAuthGuard)
  async getLicenseById(@Param('id', ParseIntPipe) id: number) {
    return await this.licenseService.getLicenseByLicenseId(id);
  }

  @Get('license-to-asset')
  @UseGuards(JwtAdminAuthGuard)
  async getLicenseToAsset(@Query() licenseToAssetDto: LicenseToAssetQueryDto) {
    return await this.licenseService.getLicenseToAsset(licenseToAssetDto);
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

  @Post('checkout-license')
  @UseGuards(JwtAdminAuthGuard)
  async checkoutLicense(@Body() checkoutLicenseDto: CheckoutLicenseDto) {
    return await this.licenseService.checkoutLicense(checkoutLicenseDto);
  }

  @Post('checkin-license')
  @UseGuards(JwtAdminAuthGuard)
  async checkinLicense(@Body() checkinLicenseDto: CheckinLicenseDto) {
    return await this.licenseService.checkinLicense(checkinLicenseDto);
  }
}
