import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
  UUIDVersion,
  IsBoolean,
  IsBooleanString,
} from 'class-validator';

export class CreateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsUUID()
  @IsNotEmpty()
  superviseur_id: UUIDVersion;

  @IsUUID()
  @IsNotEmpty()
  entrepot_id: UUIDVersion;

  @IsOptional()
  @IsBoolean()
  actif: boolean;
}
