import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssetService } from './asset.service';
import { NewRequestAsset } from './dtos/new-request-asset.dto';

@ApiTags('asset')
@Controller('asset')
export class AssetController {
  constructor(private assetService: AssetService) {}

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
