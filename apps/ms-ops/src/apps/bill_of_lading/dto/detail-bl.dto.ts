import {
  IsOptional,
  IsUUID,
  IsNumber,
  IsNotEmpty,
  UUIDVersion,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Double } from 'typeorm';

export class DetailBlDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  bill_lading_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  conteneur_id: UUIDVersion;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  nbr_sacs: number;

  @ApiProperty({ type: () => 'Double' })
  @IsNotEmpty()
  @IsNumber()
  gross_weight: Double;

  @ApiProperty({ type: () => 'Double' })
  @IsNotEmpty()
  @IsNumber()
  tare: Double;

  @ApiProperty({ type: () => 'Double' })
  @IsNotEmpty()
  @IsNumber()
  measurement: Double;
}
