import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from 'src/models/entities/manufacturer.entity';
import { ManufacturerRepository } from 'src/models/repositories/manufacturer.repository';
import { FirebaseService } from '../firebase/firebase.service';
import { ManufacturerDto } from './dtos/manufacturer.dto';
import { IMAGE_PATH } from './manufacturer.constants';

@Injectable()
export class ManufacturerService {
  private logger = new Logger(ManufacturerService.name);

  constructor(
    @InjectRepository(Manufacturer)
    private manufacturerRepo: ManufacturerRepository,
    private firebaseService: FirebaseService,
  ) {}

  async getAllManufacturers() {
    const manufacturers = await this.manufacturerRepo.find({
      relations: { assetModels: true, licenses: true },
    });
    const res = manufacturers.map((manufacturer) => {
      const { assetModels, licenses, ...rest } = manufacturer;
      return {
        ...rest,
        assetModels: assetModels.length,
        licenses: licenses.length,
      };
    });
    return res;
  }

  async getManufacturerById(id: number) {
    const manufacturer = await this.manufacturerRepo.findOneBy({ id });
    return manufacturer;
  }

  async createNewManufacturer(manufacturerDto: ManufacturerDto) {
    const manufacturer = new Manufacturer();
    manufacturer.name = manufacturerDto.name;
    await this.manufacturerRepo.save(manufacturer);
    return manufacturer;
  }

  async saveImage(id: number, file: Express.Multer.File) {
    // upload ảnh lên storage
    const image = await this.firebaseService.uploadFile(file, IMAGE_PATH);
    // cập nhật db
    return await this.manufacturerRepo.update({ id }, { image });
  }

  async updateManufacturer(id: number, manufacturerDto: ManufacturerDto) {
    let toUpdate = await this.manufacturerRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, manufacturerDto);
    return await this.manufacturerRepo.save(updated);
  }

  async deleteManufacturer(id: number) {
    return await this.manufacturerRepo.delete({ id });
  }
}
