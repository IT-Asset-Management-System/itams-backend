import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class NewRequestAsset {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  categoryId: number;
}
