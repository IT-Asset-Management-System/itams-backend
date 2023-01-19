import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AdminEntity from 'src/models/entities/admin.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from 'src/models/repositories/admin.repository';
import { BullModule } from '@nestjs/bull';
import { AVATAR_ADMIN_QUEUE } from './admin.constants';
import { AvatarProcessor } from './processors/avatar.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    BullModule.registerQueue({
      name: AVATAR_ADMIN_QUEUE,
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository, AvatarProcessor],
  exports: [AdminService],
})
export class AdminModule {}
