import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from 'src/models/entities/user.enitity';
import { UserRepository } from 'src/models/repositories/user.repository';
import CreateUserDto from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectQueue } from '@nestjs/bull';
import {
  AVATAR_QUEUE,
  DEFAULT_AVATAR,
  RESIZING_AVATAR,
} from './user.constants';
import { Queue } from 'bull';
import UpdateProfileDto from './dtos/update-profile.dto';
import * as fs from 'fs';
import { DepartmentService } from '../department/department.service';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: UserRepository,
    @InjectQueue(AVATAR_QUEUE)
    private avatarQueue: Queue,
    private departmentService: DepartmentService,
  ) {}

  async getAll() {
    const users = await this.userRepo.find({ relations: { department: true } });
    const res = users.map((user) => {
      const { department, password, ...rest } = user;
      return {
        ...rest,
        department: department?.name,
      };
    });
    return res;
  }

  async getUserByUserId(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { department: true },
    });
    const { department, password, ...rest } = user;
    if (user) {
      return { ...rest, department: department.name };
    }

    throw new HttpException(
      'No user with this ID has been found',
      HttpStatus.NOT_FOUND,
    );
  }

  async createNewUser(userDto: UserDto) {
    const department = await this.departmentService.getDepartmentById(
      userDto.departmentId,
    );

    const user = new UserEntity();
    user.name = userDto.name;
    user.username = userDto.username;
    user.password = await bcrypt.hash(userDto.password, 10);
    user.avatar = userDto.avatar;
    user.department = department;

    await this.userRepo.save(user);
    return user;
  }

  async updateUser(id: number, userDto: UserDto) {
    let toUpdate = await this.userRepo.findOneBy({ id });
    let { password, departmentId, ...rest } = userDto;
    const department = await this.departmentService.getDepartmentById(
      userDto.departmentId,
    );
    let updated = Object.assign(toUpdate, rest);
    updated.password = await bcrypt.hash(userDto.password, 10);
    updated.department = department;
    return await this.userRepo.save(updated);
  }

  async deleteUser(id: number) {
    return await this.userRepo.delete({ id });
  }

  async getUserByUsername(username: string) {
    const user = await this.userRepo.findOneBy({ username });

    if (user) {
      return user;
    }

    // throw new HttpException(
    //   'No user with this username has been found',
    //   HttpStatus.NOT_FOUND,
    // );
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (user) {
      return user;
    }

    throw new HttpException(
      'No user with this ID has been found',
      HttpStatus.NOT_FOUND,
    );
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = new UserEntity();
    newUser.username = createUserDto.username;
    newUser.password = createUserDto.password;

    await this.userRepo.save(newUser);

    return newUser;
  }

  async addAvatarToQueue(id: number, file: Express.Multer.File) {
    try {
      this.avatarQueue.add(RESIZING_AVATAR, {
        id,
        file,
      });
    } catch (error) {
      this.logger.error(`Failed to send avatar ${file} to queue`);
    }
  }

  async deleteAvatar(userId: number) {
    const user = await this.getUserById(userId);

    if (user.avatar != DEFAULT_AVATAR) {
      fs.unlink('./uploads/avatars/40x40/' + user.avatar, (err) => {
        if (err) {
          console.error(err);
          return err;
        }
      });

      fs.unlink('./uploads/avatars/original/' + user.avatar, (err) => {
        if (err) {
          console.error(err);
          return err;
        }
      });

      user.avatar = DEFAULT_AVATAR;
    }

    delete user.username;
    delete user.password;

    return this.userRepo.save(user);
  }

  async updateProfile(userId: number, userData: UpdateProfileDto) {
    let toUpdate = await this.getUserById(userId);

    // TODO why delete?
    delete toUpdate.password;
    delete toUpdate.username;

    let updated = Object.assign(toUpdate, userData);
    return await this.userRepo.save(updated);
  }

  async setNewPassword(username: string, password: string) {
    const user = await this.getUserByUsername(username);

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepo.update(user.id, {
      password: hashedPassword,
    });
  }
}
