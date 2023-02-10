import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import AdminEntity from 'src/models/entities/admin.entity';
import { AdminRepository } from 'src/models/repositories/admin.repository';
import {
  AVATAR_ADMIN_QUEUE,
  DEFAULT_AVATAR,
  RESIZING_AVATAR_ADMIN,
} from './admin.constants';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import UpdateProfileDto from './dtos/update-profile.dto';

@Injectable()
export class AdminService {
  private logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(AdminEntity)
    private adminRepo: AdminRepository,
    @InjectQueue(AVATAR_ADMIN_QUEUE)
    private avatarQueue: Queue,
  ) {}

  async getAdminByUsername(username: string) {
    const admin = await this.adminRepo.findOneBy({ username });

    if (admin) {
      return admin;
    }

    // throw new HttpException(
    //   'No admin with this username has been found',
    //   HttpStatus.NOT_FOUND,
    // );
  }

  async getAdminById(id: number) {
    const admin = await this.adminRepo.findOneBy({ id });

    if (admin) {
      return admin;
    }

    throw new HttpException(
      'No admin with this ID has been found',
      HttpStatus.NOT_FOUND,
    );
  }

  async addAvatarToQueue(id: number, file: Express.Multer.File) {
    try {
      this.avatarQueue.add(RESIZING_AVATAR_ADMIN, {
        id,
        file,
      });
    } catch (error) {
      this.logger.error(`Failed to send avatar ${file} to queue`);
    }
  }

  async deleteAvatar(adminId: number) {
    const admin = await this.getAdminById(adminId);

    if (admin.avatar != DEFAULT_AVATAR) {
      fs.unlink('./uploads/admin/avatars/40x40/' + admin.avatar, (err) => {
        if (err) {
          console.error(err);
          return err;
        }
      });

      fs.unlink('./uploads/admin/avatars/original/' + admin.avatar, (err) => {
        if (err) {
          console.error(err);
          return err;
        }
      });

      admin.avatar = DEFAULT_AVATAR;
    }

    delete admin.username;
    delete admin.password;

    return this.adminRepo.save(admin);
  }

  async updateProfile(adminId: number, adminData: UpdateProfileDto) {
    let toUpdate = await this.getAdminById(adminId);

    // TODO why delete?
    delete toUpdate.password;
    delete toUpdate.username;

    let updated = Object.assign(toUpdate, adminData);
    return await this.adminRepo.save(updated);
  }

  async setNewPassword(username: string, password: string) {
    const admin = await this.getAdminByUsername(username);

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.adminRepo.update(admin.id, {
      password: hashedPassword,
    });
  }
}
