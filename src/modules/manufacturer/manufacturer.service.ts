import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from 'src/models/entities/manufacturer.entity';
import { ManufacturerRepository } from 'src/models/repositories/manufacturer.repository';

@Injectable()
export class ManufacturerService {
  private logger = new Logger(ManufacturerService.name);

  constructor(
    @InjectRepository(Manufacturer)
    private manufacturerRepo: ManufacturerRepository,
  ) {}

  async getAllManufacturers() {
    const categories = await this.manufacturerRepo.find();
    return categories;
  }

  async getManufacturerById(id: number) {
    const manufacturer = await this.manufacturerRepo.findOneBy({ id });
    return manufacturer;
  }
}
