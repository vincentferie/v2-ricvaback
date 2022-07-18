import { ApiProperty } from '@nestjs/swagger';
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
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StateChargement } from '@app/saas-component/helpers/enums';

export class CreateUnloadingDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsUUID()
  campagne_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  superviseur_id: UUIDVersion;

  @ApiProperty()
  @IsUUID()
  provenance_id: UUIDVersion;

  @ApiProperty()
  @IsUUID()
  specificity_id: UUIDVersion;

  @ApiProperty()
  @IsUUID()
  exportateur_id: UUIDVersion;

  @ApiProperty()
  @IsUUID()
  entrepot_id: UUIDVersion;

  @ApiProperty()
  @IsUUID()
  speculation_id: UUIDVersion;

  @ApiProperty()
  @IsString()
  num_fiche: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date_dechargement: Date;

  @ApiProperty()
  @IsString()
  tracteur: string;

  @ApiProperty()
  @IsString()
  remorque: string;

  @ApiProperty()
  @IsString()
  fournisseur: string;

  @ApiProperty()
  @IsString()
  contact_fournisseur: string;

  @ApiProperty()
  @IsString()
  transporteur: string;

  @ApiProperty()
  @IsNotEmpty()
  // @IsEnum(StateChargement)
  @Matches(
    `^${Object.values(StateChargement)
      .filter((v) => typeof v == 'number')
      .join('|')}$`,
    'i',
  )
  statut: StateChargement;

  @ApiProperty({ type: () => Boolean, description: 'Statut du déchargement' })
  @IsBoolean()
  @IsOptional()
  validity: boolean;

  @ApiProperty({ description: 'Fiche de Transfert File' })
  @IsOptional()
  file: any;
}
