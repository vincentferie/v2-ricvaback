import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  UUIDVersion,
} from 'class-validator';

export class UpdateDto {
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
