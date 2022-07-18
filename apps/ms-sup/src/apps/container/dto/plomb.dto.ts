import {
  IsOptional,
  IsUUID,
  IsString,
  IsNumber,
  IsNotEmpty,
  UUIDVersion,
} from 'class-validator';

export class PlombDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  conteneur_id: UUIDVersion;

  @IsString()
  @IsNotEmpty()
  pb_lettre: string;

  @IsNumber()
  @IsNotEmpty()
  pb_chiffre: number;
}
