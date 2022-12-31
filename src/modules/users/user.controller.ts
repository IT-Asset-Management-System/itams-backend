import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { of } from 'rxjs';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { join } from 'path';
import RequestWithUser from '../auth/interfaces/request-with-user.interface';
import UpdateProfileDto from './dtos/update-profile.dto';
import { avatarStorageOptions } from './helpers/avatar-storage';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UsersService) {}

  @Put('update-profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() request: RequestWithUser,
    @Body() userData: UpdateProfileDto,
  ) {
    return await this.userService.updateProfile(request.user.id, userData);
  }

  @Post('save-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', avatarStorageOptions))
  async saveAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: RequestWithUser,
  ) {
    return await this.userService.addAvatarToQueue(request.user.id, file);
  }

  @Get('get-avatar')
  @UseGuards(JwtAuthGuard)
  async findAvatar(@Req() request: RequestWithUser, @Res() res) {
    return of(
      res.sendFile(
        join(process.cwd(), './uploads/avatars/40x40/' + request.user.avatar),
      ),
    );
  }

  @Delete('delete-avatar')
  @UseGuards(JwtAuthGuard)
  async deleteAvatar(@Req() request: RequestWithUser) {
    return this.userService.deleteAvatar(request.user.id);
  }
}
