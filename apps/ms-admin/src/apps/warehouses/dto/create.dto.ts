import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
  UUIDVersion,
  IsNumber,
} from 'class-validator';
import { Double } from 'typeorm';

export class CreateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  site_id: UUIDVersion;

  @IsString()
  @IsNotEmpty()
  libelle: string;

  @IsNumber()
  @IsOptional()
  superficie: Double;

  @IsNumber()
  @IsOptional()
  coordonneex: Double;

  @IsNumber()
  @IsOptional()
  coordonneey: Double;
}
