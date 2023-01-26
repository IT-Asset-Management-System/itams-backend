import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Department from 'src/models/entities/department.entity';
import { DepartmentRepository } from 'src/models/repositories/department.repository';
import { LocationService } from '../location/location.service';
import { DepartmentDto } from './dtos/department.dto';

@Injectable()
export class DepartmentService {
  private logger = new Logger(DepartmentService.name);

  constructor(
    @InjectRepository(Department) private departmentRepo: DepartmentRepository,
    private locationService: LocationService,
  ) {}

  async getAllDepartments() {
    const departments = await this.departmentRepo.find({
      relations: { assets: true, users: true, location: true },
    });
    const res = departments.map((department) => {
      const { assets, users, location, ...rest } = department;
      return {
        ...rest,
        numOfAssets: assets?.length ?? 0,
        numOfUsers: users?.length ?? 0,
        location: location.name,
      };
    });
    return res;
  }

  async getDepartmentById(id: number) {
    const department = await this.departmentRepo.findOneBy({ id });
    return department;
  }

  async createNewDepartment(departmentDto: DepartmentDto) {
    const department = new Department();
    department.name = departmentDto.name;
    await this.departmentRepo.save(department);
    return department;
  }

  async updateDepartment(id: number, departmentDto: DepartmentDto) {
    let toUpdate = await this.departmentRepo.findOneBy({ id });
    let { locationId, ...rest } = departmentDto;
    const location = await this.locationService.getLocationById(
      departmentDto.locationId,
    );
    let updated = Object.assign(toUpdate, rest);
    updated.location = location;
    return await this.departmentRepo.save(updated);
  }

  async deleteDepartment(id: number) {
    return await this.departmentRepo.delete({ id });
  }
}
