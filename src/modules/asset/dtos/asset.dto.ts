import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssetDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  purchase_cost: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  manufacturerId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  supplierId: number;
}
