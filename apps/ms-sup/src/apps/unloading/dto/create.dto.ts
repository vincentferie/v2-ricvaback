import {
  IsOptional,
  IsUUID,
  IsString,
  IsDate,
  IsNumberString,
  IsBooleanString,
  UUIDVersion,
  IsEnum,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StateChargement } from '@app/saas-component/helpers/enums';

export class CreateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsUUID()
  campagne_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  superviseur_id: UUIDVersion;

  @IsUUID()
  provenance_id: UUIDVersion;

  @IsUUID()
  specificity_id: UUIDVersion;

  @IsUUID()
  exportateur_id: UUIDVersion;

  @IsUUID()
  entrepot_id: UUIDVersion;

  @IsUUID()
  speculation_id: UUIDVersion;

  @IsString()
  num_fiche: string;

  @IsDate()
  @Type(() => Date)
  date_dechargement: Date;

  @IsString()
  tracteur: string;

  @IsString()
  remorque: string;

  @IsString()
  fournisseur: string;

  @IsString()
  contact_fournisseur: string;

  @IsString()
  transporteur: string;

  @IsEnum(StateChargement)
  statut: StateChargement;

  @IsOptional()
  @IsBoolean()
  validity: boolean;

  @IsOptional()
  file: any;
}
