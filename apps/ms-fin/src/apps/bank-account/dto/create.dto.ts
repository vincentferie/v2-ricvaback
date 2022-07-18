import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsUUID,
  UUIDVersion,
} from 'class-validator';
import { MovementDto } from '../../pre-financing/dto/movement.dto';
import { SubBankAccompteDto } from './sub-bank-account.dto';

export class CreateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsUUID()
  campagne_id: UUIDVersion;

  @IsUUID()
  banque_id: UUIDVersion;

  @IsNumber()
  solde: number;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  sousCompte: SubBankAccompteDto[];
}
