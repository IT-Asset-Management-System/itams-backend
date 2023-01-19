import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { SupplierService } from './supplier.service';

@ApiTags('supplier')
@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllSuppliers() {
    return await this.supplierService.getAllSuppliers();
  }
}
