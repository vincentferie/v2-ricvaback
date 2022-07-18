import {
  IsOptional,
  IsUUID,
  IsString,
  IsDate,
  UUIDVersion,
  IsNumberString,
  IsBooleanString,
  IsBoolean,
  IsEnum,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StateChargement } from '@app/saas-component/helpers/enums';

export class UpdateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  campagne_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  superviseur_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  provenance_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  specificity_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  exportateur_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  @IsOptional()
  entrepot_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  @IsOptional()
  speculation_id: UUIDVersion;

  @IsOptional()
  @IsString()
  num_fiche: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date_dechargement: Date;

  @IsOptional()
  @IsString()
  tracteur: string;

  @IsOptional()
  @IsString()
  remorque: string;

  @IsOptional()
  @IsString()
  fournisseur: string;

  @IsOptional()
  @IsString()
  contact_fournisseur: string;

  @IsOptional()
  @IsString()
  transporteur: string;

  @IsOptional()
  @IsEnum(StateChargement)
  statut: StateChargement;

  @IsOptional()
  @IsBoolean()
  validity: boolean;

  @IsOptional()
  file: any;
}
