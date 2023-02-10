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
import { SourceCodeDto } from './dtos/sourceCode.dto';
import { SourceCodeService } from './sourceCode.service';

@ApiTags('source-code')
@Controller('source-code')
export class SourceCodeController {
  constructor(private sourceCodeService: SourceCodeService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllSourceCodes() {
    return await this.sourceCodeService.getAllSourceCodes();
  }

  @Get('get-source-code-by-id')
  @UseGuards(JwtAllAuthGuard)
  async getSourceCodeById(@Body('id', ParseIntPipe) id: number) {
    return await this.sourceCodeService.getSourceCodeById(id);
  }

  @Post('create-source-code')
  @UseGuards(JwtAdminAuthGuard)
  async createSourceCode(@Body() sourceCodeDto: SourceCodeDto) {
    return await this.sourceCodeService.createNewSourceCode(sourceCodeDto);
  }

  @Put('update-source-code')
  @UseGuards(JwtAdminAuthGuard)
  async updateSourceCode(
    @Body() sourceCodeDto: SourceCodeDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.sourceCodeService.updateSourceCode(id, sourceCodeDto);
  }

  @Delete('delete-source-code')
  @UseGuards(JwtAdminAuthGuard)
  async deleteSourceCode(@Body('id', ParseIntPipe) id: number) {
    return await this.sourceCodeService.deleteSourceCode(id);
  }
}
