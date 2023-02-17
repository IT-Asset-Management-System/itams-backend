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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssetService } from './asset.service';
import { AssetDto } from './dtos/asset.dto';
import { AssetHistoryQueryDto } from './dtos/assetHistoryQuery.dto';
import { AssetQueryDto } from './dtos/assetQuery.dto';
import { CheckinAssetDto } from './dtos/checkinAsset.dto';
import { CheckoutAssetDto } from './dtos/checkoutAsset.dto';
import { NewRequestAsset } from './dtos/new-request-asset.dto';

@ApiTags('asset')
@Controller('asset')
export class AssetController {
  constructor(private assetService: AssetService) {}

  @Get('all-assets')
  @UseGuards(JwtAdminAuthGuard)
  async getAllAssets(@Query() assetQuery: AssetQueryDto) {
    return await this.assetService.getAll(assetQuery);
  }

  @Get('asset-history')
  @UseGuards(JwtAdminAuthGuard)
  async getAssetHistory(@Query() assetHistoryQueryDto: AssetHistoryQueryDto) {
    return await this.assetService.getAssetHistory(assetHistoryQueryDto);
  }

  @Get('get-asset-by-id/:id')
  @UseGuards(JwtAdminAuthGuard)
  async getAssetById(@Param('id', ParseIntPipe) id: number) {
    return await this.assetService.getAssetByAssetId(id);
  }

  @Post('create-asset')
  @UseGuards(JwtAdminAuthGuard)
  async createAsset(@Body() assetDto: AssetDto) {
    return await this.assetService.createNewAsset(assetDto);
  }

  @Post('import-asset')
  @UseGuards(JwtAdminAuthGuard)
  async importAsset(@Body() assetDto: AssetDto[]) {
    return await this.assetService.importAsset(assetDto);
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
  async deleteAsset(@Body('id', ParseIntPipe) id: number) {
    return await this.assetService.deleteAsset(id);
  }

  @Post('checkout-asset')
  @UseGuards(JwtAdminAuthGuard)
  async checkoutAsset(@Body() checkoutAssetDto: CheckoutAssetDto) {
    return await this.assetService.checkoutAsset(checkoutAssetDto);
  }

  @Post('checkin-asset')
  @UseGuards(JwtAdminAuthGuard)
  async checkinAsset(@Body() checkinAssetDto: CheckinAssetDto) {
    return await this.assetService.checkinAsset(checkinAssetDto);
  }

  @Get('all-request-assets')
  @UseGuards(JwtAdminAuthGuard)
  async getAllRequestAssets() {
    return await this.assetService.getAllRequestAssets();
  }

  @Post('accept-request')
  @UseGuards(JwtAdminAuthGuard)
  async acceptRequest(
    @Body('id', ParseIntPipe) id: number,
    @Body('assetId', ParseIntPipe) assetId: number,
  ) {
    return await this.assetService.acceptRequest(id, assetId);
  }

  @Post('reject-request')
  @UseGuards(JwtAdminAuthGuard)
  async rejectRequest(@Body('id', ParseIntPipe) id: number) {
    return await this.assetService.rejectRequest(id);
  }

  @Get('asset-by-model')
  @UseGuards(JwtAdminAuthGuard)
  async getAssetsByModel(@Query('assetModelId') assetModelId: number) {
    return await this.assetService.getAssetsByModel(assetModelId);
  }

  /*------------------------ user ------------------------- */

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
      newRequest,
    );
  }
}
