import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'src/models/entities/location.entity';
import { LocationRepository } from 'src/models/repositories/location.entity';
import { LocationDto } from './dtos/location';

@Injectable()
export class LocationService {
  private logger = new Logger(LocationService.name);

  constructor(
    @InjectRepository(Location) private locationRepo: LocationRepository,
  ) {}

  async getAllLocations() {
    const locations = await this.locationRepo.find({
      relations: { departments: true },
    });
    const res = locations.map((location) => {
      const { departments, ...rest } = location;
      return {
        ...rest,
        numOfDepartments: departments?.length ?? 0,
      };
    });
    return res;
  }

  async getLocationById(id: number) {
    const location = await this.locationRepo.findOneBy({ id });
    return location;
  }

  async createNewLocation(locationDto: LocationDto) {
    const location = new Location();
    location.name = locationDto.name;
    location.address = locationDto.address;
    await this.locationRepo.save(location);
    return location;
  }

  async updateLocation(id: number, locationDto: LocationDto) {
    let toUpdate = await this.locationRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, locationDto);
    return await this.locationRepo.save(updated);
  }

  async deleteLocation(id: number) {
    return await this.locationRepo.delete({ id });
  }
}
