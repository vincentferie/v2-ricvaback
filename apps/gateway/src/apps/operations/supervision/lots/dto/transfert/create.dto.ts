import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsUUID,
  IsString,
  UUIDVersion,
  IsNumber,
} from 'class-validator';
export class CreateTransfertDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  lot_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  site_provenance_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  site_destination_id: UUIDVersion;

  @ApiProperty()
  @IsString()
  statut_tirage: string;

  @ApiProperty()
  @IsNumber()
  poids_net_mq: number;

  @ApiProperty()
  @IsNumber()
  sac_mq: number;

  @ApiProperty()
  @IsNumber()
  poids_net_dechet: number;

  @ApiProperty()
  @IsNumber()
  sac_dechet: number;

  @ApiProperty()
  @IsNumber()
  poids_net_poussiere: number;

  @ApiProperty()
  @IsNumber()
  total_sac_trie: number;

  @ApiProperty()
  @IsNumber()
  sac_poussiere: number;
}
