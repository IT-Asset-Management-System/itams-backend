import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SourceCode } from 'src/models/entities/sourceCode.entity';
import { SourceCodeRepository } from 'src/models/repositories/sourceCode.repository';
import { SourceCodeDto } from './dtos/sourceCode.dto';

@Injectable()
export class SourceCodeService {
  private logger = new Logger(SourceCodeService.name);

  constructor(
    @InjectRepository(SourceCode)
    private sourceCodeRepo: SourceCodeRepository,
  ) {}

  async getAllSourceCodes() {
    const sourceCodes = await this.sourceCodeRepo.find();
    return sourceCodes;
  }

  async getSourceCodeById(id: number) {
    const sourceCode = await this.sourceCodeRepo.findOneBy({ id });
    return sourceCode;
  }

  async createNewSourceCode(sourceCodeDto: SourceCodeDto) {
    const sourceCode = Object.assign({}, sourceCodeDto);
    await this.sourceCodeRepo.save(sourceCode);
    return sourceCode;
  }

  async updateSourceCode(id: number, sourceCodeDto: SourceCodeDto) {
    let toUpdate = await this.sourceCodeRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, sourceCodeDto);
    return await this.sourceCodeRepo.save(updated);
  }

  async deleteSourceCode(id: number) {
    return await this.sourceCodeRepo.delete({ id });
  }
}
