import {
  IsOptional,
  IsUUID,
  UUIDVersion,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class DetailPlanDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  plan_empotage_id: UUIDVersion;

  @IsNotEmpty()
  @IsUUID()
  lot_id: UUIDVersion;

  @IsNotEmpty()
  @IsNumber()
  nbr_sacs: number;
}
