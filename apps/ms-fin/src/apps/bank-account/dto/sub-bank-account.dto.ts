import {
  IsOptional,
  IsUUID,
  UUIDVersion,
  IsNumber,
  IsDate,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MovementDto } from '../../pre-financing/dto/movement.dto';

export class SubBankAccompteDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsUUID()
  @IsOptional()
  compte_banque_id: UUIDVersion;

  @IsOptional()
  @IsString()
  num_ref: string;

  @IsString()
  libelle: string;

  @IsNumber()
  solde: number;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  mouvement: MovementDto;
}
