import {
  Controller,
  Get,
  UseGuards,
  Post,
  Put,
  Body,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { ManufacturerDto } from './dtos/manufacturer.dto';
import { ManufacturerService } from './manufacturer.service';

@ApiTags('manufacturer')
@Controller('manufacturer')
export class ManufacturerController {
  constructor(private manufacturerService: ManufacturerService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllManufacturers() {
    return await this.manufacturerService.getAllManufacturers();
  }

  @Get('get-manufacturer-by-id')
  @UseGuards(JwtAllAuthGuard)
  async getManufacturerById(@Body('id', ParseIntPipe) id: number) {
    return await this.manufacturerService.getManufacturerById(id);
  }

  @Post('create-manufacturer')
  @UseGuards(JwtAdminAuthGuard)
  async createManufacturer(@Body() manufacturerDto: ManufacturerDto) {
    return await this.manufacturerService.createNewManufacturer(
      manufacturerDto,
    );
  }

  @Put('update-manufacturer')
  @UseGuards(JwtAdminAuthGuard)
  async updateManufacturer(
    @Body() manufacturerDto: ManufacturerDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.manufacturerService.updateManufacturer(
      id,
      manufacturerDto,
    );
  }

  @Delete('delete-manufacturer')
  @UseGuards(JwtAdminAuthGuard)
  async deleteManufacturer(@Body('id', ParseIntPipe) id: number) {
    return await this.manufacturerService.deleteManufacturer(id);
  }
}
