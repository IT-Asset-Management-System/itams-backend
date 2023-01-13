import {
  Injectable,
  HttpException,
  HttpStatus,
  ConsoleLogger,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import RegisterDto from './dtos/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByUsername(username);
    if (user && this.checkPassword(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    try {
      const newUser = await this.usersService.createUser({
        ...registerDto,
        password: hashedPassword,
      });

      return newUser;
    } catch (error) {
      if (error?.code == 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Email has already been taken',
          HttpStatus.BAD_REQUEST,
        );
      }
      console.log(error);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changePassword(
    username: string,
    hashPassword: string,
    currentPassword: string,
    newPassword: string,
  ) {
    await this.checkPassword(currentPassword, hashPassword);
    await this.usersService.setNewPassword(username, newPassword);
  }

  private async checkPassword(rawPassword: string, hashedPassword: string) {
    const isPasswordTrue = await bcrypt.compare(rawPassword, hashedPassword);

    if (!isPasswordTrue) {
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }
  }
}
