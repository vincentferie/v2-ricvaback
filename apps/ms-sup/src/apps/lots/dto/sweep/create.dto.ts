import { Type } from 'class-transformer';
import {
  IsOptional,
  IsUUID,
  IsString,
  IsDate,
  IsBooleanString,
  UUIDVersion,
  IsEnum,
  IsInt,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Double } from 'typeorm';

export class CreateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  lot_id: UUIDVersion;

  @IsOptional()
  entrepot_id: UUIDVersion;

  @IsOptional()
  campagne_id: UUIDVersion;

  @IsNotEmpty()
  @IsNumber()
  nbr_sacs: number;

  @IsDate()
  @Type(() => Date)
  date: Date;
}
