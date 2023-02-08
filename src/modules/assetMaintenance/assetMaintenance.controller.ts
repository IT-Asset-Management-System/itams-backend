import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { AssetMaintenanceService } from './assetMaintenance.service';
import { AssetMaintenanceDto } from './dtos/assetMaintenance.dto';

@ApiTags('asset-maintenance')
@Controller('asset-maintenance')
export class AssetMaintenanceController {
  constructor(private assetMaintenanceService: AssetMaintenanceService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllAssetMaintenances() {
    return await this.assetMaintenanceService.getAllAssetMaintenances();
  }

  @Get('get-asset-maintenance-by-id')
  @UseGuards(JwtAllAuthGuard)
  async getAssetMaintenanceById(@Body('id', ParseIntPipe) id: number) {
    return await this.assetMaintenanceService.getAssetMaintenanceById(id);
  }

  @Post('create-asset-Maintenance')
  @UseGuards(JwtAdminAuthGuard)
  async createAssetMaintenance(
    @Body() assetMaintenanceDto: AssetMaintenanceDto,
  ) {
    return await this.assetMaintenanceService.createNewAssetMaintenance(
      assetMaintenanceDto,
    );
  }

  @Put('update-asset-Maintenance')
  @UseGuards(JwtAdminAuthGuard)
  async updateAssetMaintenance(
    @Body() assetMaintenanceDto: AssetMaintenanceDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.assetMaintenanceService.updateAssetMaintenance(
      id,
      assetMaintenanceDto,
    );
  }

  @Delete('delete-asset-Maintenance')
  @UseGuards(JwtAdminAuthGuard)
  async deleteAssetMaintenance(@Body('id', ParseIntPipe) id: number) {
    return await this.assetMaintenanceService.deleteAssetMaintenance(id);
  }
}