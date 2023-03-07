import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckinLicenseDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  licenseId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  checkin_date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  checkin_note: string;
}
