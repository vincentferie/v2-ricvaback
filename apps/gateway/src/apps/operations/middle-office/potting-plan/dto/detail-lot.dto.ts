import {
  IsOptional,
  IsUUID,
  UUIDVersion,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { number } from 'joi';

export class DetailPlanDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty({ type: IsUUID, description: 'ID of plan' })
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  plan_empotage_id: UUIDVersion;

  @ApiProperty({ type: IsUUID, description: 'ID of Lot' })
  @IsNotEmpty()
  @IsUUID()
  lot_id: UUIDVersion;

  @ApiProperty({ type: number, description: 'number of bags' })
  @IsNotEmpty()
  @IsNumber()
  nbr_sacs: number;
}
