import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  UUIDVersion,
} from 'class-validator';
export class ReportWarnDto {
  @IsNotEmpty()
  @IsUUID()
  id: UUIDVersion;

  @IsNotEmpty()
  @IsUUID()
  dechargement_id: UUIDVersion;

  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  lot_id: UUIDVersion;

  @IsNotEmpty()
  @IsUUID()
  superviseur_id: UUIDVersion;

  @IsNotEmpty()
  @IsString()
  motif: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}
