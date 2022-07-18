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
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Double } from 'typeorm';
import { Type } from 'class-transformer';

export class CreateCampagneDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty({
    type: IsUUID,
    description: 'Master campagne selection',
  })
  @IsUUID()
  campagne_id: UUIDVersion;

  @ApiProperty({
    type: IsString,
    description: 'Part of campagne for specifie',
    example: 'Tranche 1',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  libelle: string;

  @ApiProperty({
    type: Date,
    description: 'Date of campagne tranche started',
    example: 'dd/mm/yyyy',
  })
  @IsDate()
  @Type(() => Date)
  ouverture: Date;

  @ApiProperty({
    type: Date,
    description: 'Date of campagne tranche stopped',
    example: 'dd/mm/yyyy',
  })
  @IsDate()
  @Type(() => Date)
  fermeture: Double;
}
