import { Type } from 'class-transformer';
import {
  IsOptional,
  IsUUID,
  UUIDVersion,
  IsEnum,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsDate,
} from 'class-validator';
import { Double } from 'typeorm';

export class UpdateDto {
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
