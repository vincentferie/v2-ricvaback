import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsUUID,
  IsString,
  IsDate,
  IsBooleanString,
  UUIDVersion,
  IsEnum,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsNumberString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StateLots } from '@app/saas-component/helpers/enums';

export class CreateLotDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  campagne_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  site_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  entrepot_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  exportateur_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  speculation_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  dechargement_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  specificity_id: UUIDVersion;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  numero_ticket_pese: number;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  numero_lot: number;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  sac_en_stock: number;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  premiere_pesee: number;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  deuxieme_pesee: number;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  reconditionne: number;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  tare_emballage_refraction: number;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  poids_net: number;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  sacs_decharge: number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date_dechargement: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  // @IsEnum(StateLots)
  // @IsInt()
  @Matches(
    `^${Object.values(StateLots)
      .filter((v) => typeof v == 'number')
      .join('|')}$`,
    'i',
  )
  statut: StateLots;

  @ApiProperty({
    type: () => Boolean,
    description: 'Statut de certification lot',
  })
  //@IsBoolean()
  @IsBooleanString()
  @IsOptional()
  @IsBoolean()
  validity: boolean;

  @ApiProperty({ description: 'Fiche de Transfert File' })
  @IsOptional()
  file: any;
}
