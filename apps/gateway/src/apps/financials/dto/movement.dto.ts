import {
  IsOptional,
  IsUUID,
  UUIDVersion,
  IsNumber,
  IsDate,
  IsString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  NatureOperation,
  TypeMovement,
} from '@app/saas-component/helpers/enums';

export class MovementDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsUUID()
  @IsOptional()
  compte_banque_id: UUIDVersion;

  @IsUUID()
  @IsOptional()
  sous_compte_banque_id: UUIDVersion;

  @IsOptional()
  @IsString()
  intitule: string;

  @IsOptional()
  @IsNumber()
  solde_en_date: number;

  @IsOptional()
  @IsNumber()
  valeur: number;

  @IsOptional()
  @IsEnum(NatureOperation)
  nature: NatureOperation;

  @IsOptional()
  @IsEnum(TypeMovement)
  type: TypeMovement;

  @IsDate()
  @Type(() => Date)
  date: Date;
}
