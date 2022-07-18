import {
  IsOptional,
  IsUUID,
  IsDate,
  IsString,
  IsNotEmpty,
  UUIDVersion,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DetailBlDto } from './detail-bl.dto';
import { Type } from 'class-transformer';

export class CreateDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  campagne_id: UUIDVersion;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  numero_voyage: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  numero_bl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  provenance: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  amateur: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nom_client: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  adresse_client: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pays_client: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  port_depart: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  port_arrive: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date_embarquement: Date;

  @ApiProperty({ type: () => [DetailBlDto] })
  @IsOptional()
  details: DetailBlDto[];

  @ApiProperty({ description: 'Bl File' })
  @IsOptional()
  file: any;
}
