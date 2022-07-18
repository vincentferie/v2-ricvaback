import { ApiProperty } from '@nestjs/swagger';
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

export class CreateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsUUID()
  campagne_id: UUIDVersion;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  libelle: string;

  @IsNotEmpty()
  @IsNumber()
  outturn_min: Double;

  @IsNotEmpty()
  @IsNumber()
  outturn_max: Double;

  @IsDate()
  @Type(() => Date)
  date_debut: Date;

  @IsDate()
  @Type(() => Date)
  date_fin: Double;

  @IsNotEmpty()
  @IsNumber()
  prix: number;
}
