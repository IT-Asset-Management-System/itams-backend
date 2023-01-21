import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { DepartmentService } from './department.service';

@ApiTags('department')
@Controller('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllDepartments() {
    return await this.departmentService.getAllDepartments();
  }
}
