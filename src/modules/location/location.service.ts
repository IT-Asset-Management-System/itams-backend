import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Location from 'src/models/entities/location.entity';
import { LocationRepository } from 'src/models/repositories/location.entity';

@Injectable()
export class LocationService {
  private logger = new Logger(LocationService.name);

  constructor(
    @InjectRepository(Location) private locationRepo: LocationRepository,
  ) {}

  async getAllLocations() {
    const locations = await this.locationRepo.find();
    return locations;
  }

  async getLocationById(id: number) {
    const location = await this.locationRepo.findOneBy({ id });
    return location;
  }
}
