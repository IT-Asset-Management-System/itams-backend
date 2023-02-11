import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { join } from 'path';
import { of } from 'rxjs';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { AdminService } from './admin.service';
import UpdateProfileDto from './dtos/update-profile.dto';
import { avatarStorageOptions } from './helpers/avatar-storage';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Put('update-profile')
  @UseGuards(JwtAdminAuthGuard)
  async updateProfile(@Request() request, @Body() adminData: UpdateProfileDto) {
    return await this.adminService.updateProfile(request.user.id, adminData);
  }

  @Post('save-avatar')
  @UseGuards(JwtAdminAuthGuard)
  @UseInterceptors(FileInterceptor('image', avatarStorageOptions))
  async saveAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() request,
  ) {
    const res = await this.adminService.saveAvatar(request.user, file);
    return res;
  }

  @Delete('delete-avatar')
  @UseGuards(JwtAdminAuthGuard)
  async deleteAvatar(@Request() request) {
    return this.adminService.deleteAvatar(request.user.id);
  }
}
