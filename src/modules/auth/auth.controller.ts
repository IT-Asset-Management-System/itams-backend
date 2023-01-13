import {
  Controller,
  Body,
  Post,
  Get,
  Request,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import RegisterDto from './dtos/register.dto';
import { ApiTags } from '@nestjs/swagger';
import RequestWithUser from './interfaces/request-with-user.interface';
import ChangePasswordDto from './dtos/change-passord.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  authenticate(@Request() request: RequestWithUser) {
    const user = request.user;
    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request: RequestWithUser) {
    return this.authService.login(request.user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() request: RequestWithUser,
    @Body(new ValidationPipe()) changePassword: ChangePasswordDto,
  ) {
    await this.authService.changePassword(
      request.user.username,
      request.user.password,
      changePassword.currentPassword,
      changePassword.newPassword,
    );
  }
}
