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

export class CreateEntrepotAssignmentDto {
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
  entrepot_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  actif: boolean;
}
