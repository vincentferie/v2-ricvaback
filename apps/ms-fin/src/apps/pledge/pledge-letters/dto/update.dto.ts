import { StateTirage } from '@app/saas-component';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  UUIDVersion,
} from 'class-validator';

export class UpdateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  campagne_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  compte_banque_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  sous_compte_banque_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  exportateur_id: UUIDVersion;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  solde: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  date_tirage: Date;

  @IsOptional()
  @IsEnum(StateTirage)
  @IsInt()
  type: StateTirage;
}
