import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import DigitalContent from 'src/models/entities/digitalContent.entity';
import { DigitalContentRepository } from 'src/models/repositories/digitalContent.repository';
import { DigitalContentController } from './digitalContent.controller';
import { DigitalContentService } from './digitalContent.service';

@Module({
  imports: [TypeOrmModule.forFeature([DigitalContent])],
  controllers: [DigitalContentController],
  providers: [DigitalContentService, DigitalContentRepository],
  exports: [DigitalContentService],
})
export class DigitalContentModule {}
