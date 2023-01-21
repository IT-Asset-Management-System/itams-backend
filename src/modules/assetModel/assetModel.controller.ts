import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { AssetModelService } from './assetModel.service';

@ApiTags('asset-model')
@Controller('asset-model')
export class AssetModelController {
  constructor(private assetModelService: AssetModelService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllAssetModels() {
    return await this.assetModelService.getAllAssetModels();
  }
}
