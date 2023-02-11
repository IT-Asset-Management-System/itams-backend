import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from 'src/models/entities/user.entity';
import { UserRepository } from 'src/models/repositories/user.repository';
import { BullModule } from '@nestjs/bull';
import { AVATAR_QUEUE } from './user.constants';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { AvatarProcessor } from './processors/avatar.processor';
import { DepartmentModule } from '../department/department.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    BullModule.registerQueue({
      name: AVATAR_QUEUE,
    }),
    DepartmentModule,
    FirebaseModule,
  ],
  controllers: [UserController],
  providers: [UsersService, UserRepository, AvatarProcessor],
  exports: [UsersService],
})
export class UsersModule {}
