import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsUUID,
  UUIDVersion,
} from 'class-validator';
import { SubBankAccompteDto } from './sub-bank-account.dto';

export class UpdateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsUUID()
  @IsOptional()
  campagne_id: UUIDVersion;

  @IsUUID()
  @IsOptional()
  banque_id: UUIDVersion;

  @IsNumber()
  @IsOptional()
  solde: number;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  sousCompte: SubBankAccompteDto[];
}
