import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsDate,
  IsUUID,
  UUIDVersion,
} from 'class-validator';

export class UpdateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsString()
  @IsNotEmpty()
  libelle: string;

  @IsDate()
  @IsOptional()
  created_date: Date;

  @IsDate()
  @IsOptional()
  updated_date: Date;

  @IsString()
  @IsOptional()
  created_by: string;

  @IsString()
  @IsOptional()
  updated_by: string;

  @IsOptional()
  @IsDate()
  deleted_date: Date;
}
