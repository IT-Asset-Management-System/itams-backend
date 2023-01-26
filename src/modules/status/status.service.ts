import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Status from 'src/models/entities/status.entity';
import { StatusRepository } from 'src/models/repositories/status.repository';
import { StatusDto } from './dtos/status.dto';

@Injectable()
export class StatusService {
  private logger = new Logger(StatusService.name);

  constructor(@InjectRepository(Status) private statusRepo: StatusRepository) {}

  async getAllStatuses() {
    const statuses = await this.statusRepo.find({
      relations: { assets: true },
    });
    const res = statuses.map((status) => {
      const { assets, ...rest } = status;
      return {
        ...rest,
        numOfAssets: assets.length,
      };
    });
    return res;
  }

  async getStatusById(id: number) {
    const status = await this.statusRepo.findOneBy({ id });
    return status;
  }

  async createNewStatus(statusDto: StatusDto) {
    const status = new Status();
    status.name = statusDto.name;
    await this.statusRepo.save(status);
    return status;
  }

  async updateStatus(id: number, statusDto: StatusDto) {
    let toUpdate = await this.statusRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, statusDto);
    return await this.statusRepo.save(updated);
  }

  async deleteStatus(id: number) {
    return await this.statusRepo.delete({ id });
  }
}
