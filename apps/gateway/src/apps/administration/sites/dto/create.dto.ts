import {
  IsOptional,
  IsUUID,
  IsString,
  UUIDVersion,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Double } from 'typeorm';

export class CreateSiteDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsUUID()
  ville_id: UUIDVersion;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
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
