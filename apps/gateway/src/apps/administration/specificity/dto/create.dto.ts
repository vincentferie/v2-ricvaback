import {
  IsOptional,
  IsUUID,
  IsString,
  UUIDVersion,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSpecificityDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty({
    type: IsString,
    description: 'Once specificity of campagne',
    example: 'Zonning',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  libelle: string;
}
