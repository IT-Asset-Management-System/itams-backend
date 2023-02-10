import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { InventoryDto } from './dtos/inventory.dto';
import { UpdateAssetToInventoryDto } from './dtos/update-asset-to-inventory.dto';
import { InventoryService } from './inventory.service';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get('all')
  @UseGuards(JwtAdminAuthGuard)
  async getAllInventories() {
    return await this.inventoryService.getAllInventories();
  }

  @Get('get-inventory-by-id')
  @UseGuards(JwtAdminAuthGuard)
  async getInventoryById(@Body('id', ParseIntPipe) id: number) {
    return await this.inventoryService.getInventoryById(id);
  }

  @Post('create-inventory')
  @UseGuards(JwtAdminAuthGuard)
  async createInventory(@Body() inventoryDto: InventoryDto) {
    return await this.inventoryService.createInventory(inventoryDto);
  }

  @Put('update-inventory')
  @UseGuards(JwtAdminAuthGuard)
  async updateInventory(
    @Body() inventoryDto: InventoryDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.inventoryService.updateInventory(id, inventoryDto);
  }

  @Get('get-asset-to-inventory')
  @UseGuards(JwtAdminAuthGuard)
  async getAssetToInventoryByInventoryId(
    @Query('id', ParseIntPipe) id: number,
  ) {
    return await this.inventoryService.getAssetToInventoryByInventoryId(id);
  }

  @Put('update-asset-to-inventory')
  @UseGuards(JwtAdminAuthGuard)
  async updateAssetToInventory(
    @Body() updateDto: UpdateAssetToInventoryDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.inventoryService.updateAssetToInventory(id, updateDto);
  }
}
