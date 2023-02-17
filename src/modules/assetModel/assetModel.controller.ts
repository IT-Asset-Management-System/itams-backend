import {
  Controller,
  Get,
  UseGuards,
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
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { AssetModelService } from './assetModel.service';
import { AssetModelDto } from './dtos/assetModel.dto';
import { AssetModelQueryDto } from './dtos/assetModelQuery.dto';

@ApiTags('asset-model')
@Controller('asset-model')
export class AssetModelController {
  constructor(private assetModelService: AssetModelService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllAssetModels(@Query() assetModelQuery: AssetModelQueryDto) {
    return await this.assetModelService.getAllAssetModels(assetModelQuery);
  }

  @Get('get-asset-model-by-id/:id')
  @UseGuards(JwtAllAuthGuard)
  async getAssetModelById(@Param('id', ParseIntPipe) id: number) {
    return await this.assetModelService.getAssetModelByAssetModelId(id);
  }

  @Post('create-asset-model')
  @UseGuards(JwtAdminAuthGuard)
  async createassetModel(@Body() assetModelDto: AssetModelDto) {
    return await this.assetModelService.createNewAssetModel(assetModelDto);
  }

  @Put('update-asset-model')
  @UseGuards(JwtAdminAuthGuard)
  async updateAssetModel(
    @Body() assetModelDto: AssetModelDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.assetModelService.updateAssetModel(id, assetModelDto);
  }

  @Delete('delete-asset-model')
  @UseGuards(JwtAdminAuthGuard)
  async deleteAssetModel(@Body('id', ParseIntPipe) id: number) {
    return await this.assetModelService.deleteAssetModel(id);
  }
}
