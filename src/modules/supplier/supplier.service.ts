import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from 'src/models/entities/supplier.entity';
import { SupplierRepository } from 'src/models/repositories/supplier.repository';
import { SupplierDto } from './dtos/supplier.dto';

@Injectable()
export class SupplierService {
  private logger = new Logger(SupplierService.name);

  constructor(
    @InjectRepository(Supplier) private supplierRepo: SupplierRepository,
  ) {}

  async getAllSuppliers() {
    const suppliers = await this.supplierRepo.find({
      relations: { assets: true, licenses: true },
    });
    const res = suppliers.map((supplier) => {
      const { assets, licenses, ...rest } = supplier;
      return {
        ...rest,
        assets: assets?.length ?? 0,
        licenses: licenses?.length ?? 0,
      };
    });
    return res;
  }

  async getSupplierById(id: number) {
    const supplier = await this.supplierRepo.findOneBy({ id });
    return supplier;
  }

  async createNewSupplier(supplierDto: SupplierDto) {
    const supplier = new Supplier();
    supplier.name = supplierDto.name;
    await this.supplierRepo.save(supplier);
    return supplier;
  }

  async updateSupplier(id: number, supplierDto: SupplierDto) {
    let toUpdate = await this.supplierRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, supplierDto);
    return await this.supplierRepo.save(updated);
  }

  async deleteSupplier(id: number) {
    return await this.supplierRepo.delete({ id });
  }
}
