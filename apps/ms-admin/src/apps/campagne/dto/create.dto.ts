import { Type } from 'class-transformer';
import {
  IsOptional,
  IsUUID,
  UUIDVersion,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsUUID()
  campagne_id: UUIDVersion;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  libelle: string;

  @IsDate()
  @Type(() => Date)
  ouverture: Date;

  @IsDate()
  @Type(() => Date)
  fermeture: Date;

  @IsBoolean()
  state: boolean;
}
