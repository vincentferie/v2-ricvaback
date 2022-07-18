import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
  UUIDVersion,
  MinLength,
  MaxLength,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Double } from 'typeorm';

export class UpdateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  campagne_id: UUIDVersion;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  libelle: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  outturn_min: Double;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  outturn_max: Double;

  @IsDate()
  @Type(() => Date)
  date_debut: Date;

  @IsDate()
  @Type(() => Date)
  date_fin: Double;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  prix: number;
}
