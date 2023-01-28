import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DigitalContent } from 'src/models/entities/digitalContent.entity';
import { DigitalContentRepository } from 'src/models/repositories/digitalContent.repository';
import { DigitalContentDto } from './dtos/digitalContent.dto';

@Injectable()
export class DigitalContentService {
  private logger = new Logger(DigitalContentService.name);

  constructor(
    @InjectRepository(DigitalContent)
    private digitalContentRepo: DigitalContentRepository,
  ) {}

  async getAllDigitalContents() {
    const digitalContents = await this.digitalContentRepo.find();
    return digitalContents;
  }

  async getDigitalContentById(id: number) {
    const digitalContent = await this.digitalContentRepo.findOneBy({ id });
    return digitalContent;
  }

  async createNewDigitalContent(digitalContentDto: DigitalContentDto) {
    const digitalContent = Object.assign({}, digitalContentDto);
    await this.digitalContentRepo.save(digitalContent);
    return digitalContent;
  }

  async updateDigitalContent(id: number, digitalContentDto: DigitalContentDto) {
    let toUpdate = await this.digitalContentRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, digitalContentDto);
    return await this.digitalContentRepo.save(updated);
  }

  async deleteDigitalContent(id: number) {
    return await this.digitalContentRepo.delete({ id });
  }
}
