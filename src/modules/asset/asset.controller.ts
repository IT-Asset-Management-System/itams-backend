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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssetService } from './asset.service';
import { AssetDto } from './dtos/asset.dto';
import { NewRequestAsset } from './dtos/new-request-asset.dto';

@ApiTags('asset')
@Controller('asset')
export class AssetController {
  constructor(private assetService: AssetService) {}

  @Get('all-assets')
  @UseGuards(JwtAdminAuthGuard)
  async getAllAssets() {
    return await this.assetService.getAll();
  }

  @Get('get-asset-by-id')
  @UseGuards(JwtAdminAuthGuard)
  async getAssetById(@Body('id', ParseIntPipe) id: number) {
    return await this.assetService.getAssetById(id);
  }

  @Post('create-asset')
  @UseGuards(JwtAdminAuthGuard)
  async createAsset(@Body() assetDto: AssetDto) {
    return await this.assetService.createNewAsset(assetDto);
  }

  @Put('update-asset')
  @UseGuards(JwtAdminAuthGuard)
  async updateAsset(
    @Body() assetDto: AssetDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.assetService.updateAsset(id, assetDto);
  }

  @Delete('delete-asset')
  @UseGuards(JwtAdminAuthGuard)
  async deleteAsset(
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.assetService.deleteAsset(id);
  }

  @Get('asset-to-user')
  @UseGuards(JwtAuthGuard)
  async getAssetToUser(@Request() request) {
    return await this.assetService.getAssetToUser(request.user.id);
  }

  @Get('asset-requested')
  @UseGuards(JwtAuthGuard)
  async getAssetRequested(@Request() request) {
    return await this.assetService.getAssetRequestedByUser(request.user.id);
  }

  @Post('new-request')
  @UseGuards(JwtAuthGuard)
  async createNewRequest(
    @Request() request,
    @Body() newRequest: NewRequestAsset,
  ) {
    return await this.assetService.createNewRequestAsset(
      request.user.id,
      newRequest.categoryId,
    );
  }
}
