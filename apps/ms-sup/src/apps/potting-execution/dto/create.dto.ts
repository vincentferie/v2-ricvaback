import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  UUIDVersion,
} from 'class-validator';
import { DetailsExecutionDto } from '../detail/detail-execution.dto';
import { Type } from 'class-transformer';

export class CreateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsUUID()
  plan_empotage_id: UUIDVersion;

  @IsUUID()
  @IsNotEmpty()
  conteneur_id: UUIDVersion;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date_execution: Date;

  @IsNotEmpty()
  details: DetailsExecutionDto[];
}
