import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SourceCode from 'src/models/entities/sourceCode.entity';
import { SourceCodeRepository } from 'src/models/repositories/sourceCode.repository';
import { SourceCodeController } from './sourceCode.controller';
import { SourceCodeService } from './sourceCode.service';

@Module({
  imports: [TypeOrmModule.forFeature([SourceCode])],
  controllers: [SourceCodeController],
  providers: [SourceCodeService, SourceCodeRepository],
  exports: [SourceCodeService],
})
export class SourceCodeModule {}
