import {
  IsOptional,
  IsUUID,
  IsString,
  IsDate,
  UUIDVersion,
  IsEnum,
  IsInt,
  IsNumber,
  IsBooleanString,
  IsNumberString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StateLots } from '@app/saas-component/helpers/enums';

export class UpdateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  campagne_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  site_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  entrepot_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  exportateur_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  speculation_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  dechargement_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  specificity_id: UUIDVersion;

  @IsNumber()
  @IsOptional()
  numero_ticket_pese: number;

  @IsNumber()
  @IsOptional()
  numero_lot: number;

  @IsNumber()
  @IsOptional()
  sac_en_stock: number;

  @IsNumber()
  @IsOptional()
  premiere_pesee: number;

  @IsNumber()
  @IsOptional()
  deuxieme_pesee: number;

  @IsNumber()
  @IsOptional()
  reconditionne: number;

  @IsNumber()
  @IsOptional()
  tare_emballage_refraction: number;

  @IsNumber()
  @IsOptional()
  poids_net: number;

  @IsNumber()
  @IsOptional()
  sacs_decharge: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date_dechargement: Date;

  @IsOptional()
  @IsEnum(StateLots)
  // @IsInt()
  @IsNumberString()
  statut: StateLots;

  @IsOptional()
  @IsBoolean()
  validity: boolean;

  @IsOptional()
  file: any;
}
