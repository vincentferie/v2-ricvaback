import {
  IsOptional,
  IsUUID,
  IsNumber,
  IsNotEmpty,
  UUIDVersion,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DetailsExecutionDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsUUID()
  lot_id: UUIDVersion;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  nbr_sacs: number;
}
