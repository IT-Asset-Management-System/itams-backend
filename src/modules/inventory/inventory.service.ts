import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Asset from 'src/models/entities/asset.entity';
import AssetToInventory from 'src/models/entities/assetToInventory.entity';
import Inventory from 'src/models/entities/inventory.entity';
import { AssetToInventoryRepository } from 'src/models/repositories/assetToInventory.repository';
import { InventoryRepository } from 'src/models/repositories/inventory.repository';
import { AssetService } from '../asset/asset.service';
import { DepartmentService } from '../department/department.service';
import { StatusService } from '../status/status.service';
import { InventoryDto } from './dtos/inventory.dto';
import { UpdateAssetToInventoryDto } from './dtos/update-asset-to-inventory.dto';

@Injectable()
export class InventoryService {
  private logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(Inventory)
    private inventoryRepo: InventoryRepository,
    @InjectRepository(AssetToInventory)
    private assetToInventoryRepo: AssetToInventoryRepository,
    private assetService: AssetService,
    private departmentService: DepartmentService,
    private statusService: StatusService,
  ) {}

  async getAllInventories() {
    const inventories = await this.inventoryRepo.find({
      relations: { department: true },
    });
    const res = inventories.map((inventory) => {
      const { department, ...rest } = inventory;
      return {
        ...rest,
        department: department.name,
      };
    });
    return res;
  }

  async getInventoryById(id: number) {
    const inventory = await this.inventoryRepo.findOneBy({ id });
    return inventory;
  }

  async createInventory(inventoryDto: InventoryDto) {
    const department = await this.departmentService.getDepartmentById(
      inventoryDto.departmentId,
    );

    const inventory = new Inventory();
    inventory.name = inventoryDto.name;
    inventory.department = department;
    inventory.start_date = inventoryDto.start_date;
    inventory.end_date = inventoryDto.end_date;
    inventory.note = inventory.note;
    await this.inventoryRepo.save(inventory);

    const assets = await this.assetService.getAssetsByDepartmentId(
      inventoryDto.departmentId,
    );
    await Promise.all(
      assets.map(async (asset: Asset) => {
        const assetToInventory = new AssetToInventory();
        assetToInventory.inventory = inventory;
        assetToInventory.asset = asset;
        assetToInventory.old_cost = asset.current_cost;
        assetToInventory.new_cost = asset.current_cost;
        assetToInventory.old_status = asset.status;
        assetToInventory.new_status = asset.status;
        await this.assetToInventoryRepo.save(assetToInventory);
      }),
    );
    return inventory;
  }

  async updateInventory(id: number, inventoryDto: InventoryDto) {
    let toUpdate = await this.inventoryRepo.findOneBy({ id });
    toUpdate.name = inventoryDto?.name;
    toUpdate.start_date = inventoryDto?.start_date;
    toUpdate.note = inventoryDto?.note;
    toUpdate.end_date = inventoryDto?.end_date;
    await this.inventoryRepo.save(toUpdate);
    return toUpdate;
  }

  async getAssetToInventoryByInventoryId(id: number) {
    const assetToInventories: AssetToInventory[] =
      await this.assetToInventoryRepo.find({
        where: { inventory: { id } },
        relations: { asset: true, old_status: true, new_status: true },
      });
    const res = assetToInventories.map((assetToInventory) => {
      const { asset, old_status, new_status, ...rest } = assetToInventory;
      return {
        ...rest,
        asset_id: asset.id,
        asset_name: asset.name,
        purchase_date: asset.purchase_date,
        purchase_cost: asset.purchase_cost,
        old_status: old_status.name,
        new_status: new_status.name,
      };
    });
    return res;
  }

  async updateAssetToInventory(
    id: number,
    updateDto: UpdateAssetToInventoryDto,
  ) {
    if (
      String(updateDto?.new_cost) === '' ||
      isNaN(Number(updateDto?.new_cost)) ||
      updateDto?.new_cost < 0
    )
      throw new HttpException(
        `New cost of asset ${updateDto?.assetId} is invalid`,
        HttpStatus.BAD_REQUEST,
      );
    let toUpdate = await this.assetToInventoryRepo.findOneBy({ id });
    const status = await this.statusService.getStatusById(
      updateDto.newStatusId,
    );
    toUpdate.new_cost = updateDto?.new_cost;
    toUpdate.check = updateDto?.check;
    toUpdate.new_status = status;
    await this.assetToInventoryRepo.save(toUpdate);
    await this.assetService.saveAssetAfterInventory(
      updateDto.assetId,
      updateDto.newStatusId,
      updateDto.new_cost,
    );
    return toUpdate;
  }
}
