import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NewRequestAsset {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  assetModelId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string;
}
