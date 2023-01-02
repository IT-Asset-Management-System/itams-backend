import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssetService } from './asset.service';

@ApiTags('asset')
@Controller('asset')
export class AssetController {
  constructor(private assetService: AssetService) {}

  @Get('asset-to-user')
  @UseGuards(JwtAuthGuard)
  async getAssetToUser(@Request() request) {
    return await this.assetService.getAssetToUser(request.user.id);
  }
}
