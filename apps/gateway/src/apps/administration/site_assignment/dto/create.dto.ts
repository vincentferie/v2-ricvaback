import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNotEmpty,
  IsUUID,
  UUIDVersion,
  IsBoolean,
  IsBooleanString,
} from 'class-validator';

export class CreateSiteAssignmentDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  superviseur_id: UUIDVersion;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  site_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  actif: boolean;
}
