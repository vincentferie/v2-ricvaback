import {
  IsOptional,
  IsUUID,
  IsString,
  UUIDVersion,
  IsNumber,
} from 'class-validator';
export class CreateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  lot_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  site_provenance_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  site_destination_id: UUIDVersion;

  @IsString()
  statut_tirage: string;

  @IsNumber()
  poids_net_mq: number;

  @IsNumber()
  sac_mq: number;

  @IsNumber()
  poids_net_dechet: number;

  @IsNumber()
  sac_dechet: number;

  @IsNumber()
  poids_net_poussiere: number;

  @IsNumber()
  total_sac_trie: number;

  @IsNumber()
  sac_poussiere: number;
}
