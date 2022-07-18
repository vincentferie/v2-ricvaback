import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  UUIDVersion,
} from 'class-validator';

export class DetailsExecutionDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsUUID()
  plan_execution_id: UUIDVersion;

  @ApiProperty()
  @IsUUID()
  lot_id: UUIDVersion;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  nbr_sacs: number;
}
