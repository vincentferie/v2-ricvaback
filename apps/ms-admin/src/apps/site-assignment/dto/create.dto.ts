import {
  IsOptional,
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
  site_id: UUIDVersion;

  @IsOptional()
  @IsBoolean()
  actif: boolean;
}
