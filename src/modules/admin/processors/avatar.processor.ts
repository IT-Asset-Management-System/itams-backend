import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import * as fs from 'fs';
import AdminEntity from 'src/models/entities/admin.entity';
import { AdminRepository } from 'src/models/repositories/admin.repository';
import {
  AVATAR_ADMIN_QUEUE,
  DEFAULT_AVATAR,
  RESIZING_AVATAR_ADMIN,
} from '../admin.constants';
import { AdminService } from '../admin.service';

@Injectable()
@Processor(AVATAR_ADMIN_QUEUE)
export class AvatarProcessor {
  private logger = new Logger(AvatarProcessor.name);

  constructor(
    @InjectRepository(AdminEntity)
    private adminRepo: AdminRepository,
    private adminService: AdminService,
  ) {}

  @OnQueueActive()
  public onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process(RESIZING_AVATAR_ADMIN)
  public async resizeAvatar(
    job: Job<{ id: number; file: Express.Multer.File }>,
  ) {
    this.logger.log('Resizing and saving avatar');

    const sharp = require('sharp');

    try {
      const admin = await this.adminService.getAdminById(job.data.id);

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
      }

      await this.adminRepo.update(job.data.id, {
        avatar: job.data.file.filename,
      });

      sharp(job.data.file.path)
        .resize(40, 40)
        .toFile('./uploads/admin/avatars/40x40/' + job.data.file.filename);
    } catch (error) {
      this.logger.error('Failed to resize and save avatar');
    }
  }
}
