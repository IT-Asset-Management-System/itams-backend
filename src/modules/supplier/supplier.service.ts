import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from 'src/models/entities/supplier.entity';
import { SupplierRepository } from 'src/models/repositories/supplier.repository';

@Injectable()
export class SupplierService {
  private logger = new Logger(SupplierService.name);

  constructor(
    @InjectRepository(Supplier) private supplierRepo: SupplierRepository,
  ) {}

  async getAllSuppliers() {
    const suppliers = await this.supplierRepo.find();
    return suppliers;
  }

  async getSupplierById(id: number) {
    const supplier = await this.supplierRepo.findOneBy({ id });
    return supplier;
  }
}
