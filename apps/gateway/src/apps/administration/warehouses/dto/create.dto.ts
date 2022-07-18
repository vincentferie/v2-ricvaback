import {
  IsOptional,
  IsUUID,
  IsString,
  UUIDVersion,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Double } from 'typeorm';

export class CreateWarehouseDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  site_id: UUIDVersion;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  libelle: string;

  @ApiProperty({ type: () => 'Double' })
  @IsNumber()
  @IsOptional()
  superficie: Double;

  @ApiProperty({ type: () => 'Double' })
  @IsNumber()
  @IsOptional()
  coordonneex: Double;

  @ApiProperty({ type: () => 'Double' })
  @IsNumber()
  @IsOptional()
  coordonneey: Double;
}
