import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Department from 'src/models/entities/department.entity';
import { DepartmentRepository } from 'src/models/repositories/department.repository';

@Injectable()
export class DepartmentService {
  private logger = new Logger(DepartmentService.name);

  constructor(
    @InjectRepository(Department) private departmentRepo: DepartmentRepository,
  ) {}

  async getAllDepartments() {
    const departments = await this.departmentRepo.find();
    return departments;
  }

  async getDepartmentById(id: number) {
    const department = await this.departmentRepo.findOneBy({ id });
    return department;
  }
}
