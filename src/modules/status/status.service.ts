import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Status from 'src/models/entities/status.entity';
import { StatusRepository } from 'src/models/repositories/status.repository';

@Injectable()
export class StatusService {
  private logger = new Logger(StatusService.name);

  constructor(@InjectRepository(Status) private statusRepo: StatusRepository) {}

  async getAllStatuses() {
    const statuses = await this.statusRepo.find();
    return statuses;
  }

  async getStatusById(id: number) {
    const status = await this.statusRepo.findOneBy({ id });
    return status;
  }
}
