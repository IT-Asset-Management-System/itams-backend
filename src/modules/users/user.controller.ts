import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
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
import { join } from 'path';
import RequestWithUser from '../auth/interfaces/request-with-user.interface';
import UpdateProfileDto from './dtos/update-profile.dto';
import { avatarStorageOptions } from './helpers/avatar-storage';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { UserDto } from './dtos/user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UsersService) {}

  @Get('all-users')
  @UseGuards(JwtAdminAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllUsers() {
    return await this.userService.getAll();
  }

  @Get('get-user-by-id')
  @UseGuards(JwtAdminAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getUserById(@Body('id', ParseIntPipe) id: number) {
    return await this.userService.getUserByUserId(id);
  }

  @Post('create-user')
  @UseGuards(JwtAdminAuthGuard)
  async createUser(@Body() userDto: UserDto) {
    return await this.userService.createNewUser(userDto);
  }

  @Post('import-user')
  @UseGuards(JwtAdminAuthGuard)
  async importUser(@Body() userDto: UserDto[]) {
    return await this.userService.importUser(userDto);
  }

  @Put('update-user')
  @UseGuards(JwtAdminAuthGuard)
  async updateUser(
    @Body() userDto: UserDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.userService.updateUser(id, userDto);
  }

  @Delete('delete-user')
  @UseGuards(JwtAdminAuthGuard)
  async deleteUser(@Body('id', ParseIntPipe) id: number) {
    return await this.userService.deleteUser(id);
  }

  @Put('update-profile')
  @UseGuards(JwtAllAuthGuard)
  async updateProfile(
    @Req() request: RequestWithUser,
    @Body() userData: UpdateProfileDto,
  ) {
    return await this.userService.updateProfile(request.user.id, userData);
  }

  @Post('save-avatar')
  @UseGuards(JwtAllAuthGuard)
  @UseInterceptors(FileInterceptor('image', avatarStorageOptions))
  async saveAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: RequestWithUser,
  ) {
    const res = await this.userService.saveAvatar(request.user, file);
    return res;
  }

  @Delete('delete-avatar')
  @UseGuards(JwtAllAuthGuard)
  async deleteAvatar(@Req() request: RequestWithUser) {
    return this.userService.deleteAvatar(request.user.id);
  }
}
