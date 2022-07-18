import {
  IsOptional,
  IsUUID,
  UUIDVersion,
  IsNotEmpty,
  IsEnum,
  IsInt,
  IsString,
} from 'class-validator';
import { ContainerPlanDto } from './detail-container.dto';
import { DetailPlanDto } from './detail-lot.dto';
import { StateBooking } from '@app/saas-component';
import { Type } from 'class-transformer';

export class UpdateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsNotEmpty()
  @IsUUID()
  entrepot_id: UUIDVersion;

  @IsNotEmpty()
  @IsUUID()
  transitaire_id: UUIDVersion;

  @IsNotEmpty()
  @IsString()
  numero: string;

  @IsEnum(StateBooking)
  @IsInt()
  state: StateBooking;

  @IsNotEmpty()
  @IsString()
  @Type(() => Date)
  date_execution: Date;

  @IsOptional()
  @IsNotEmpty()
  conteneurs: ContainerPlanDto[];

  @IsNotEmpty()
  @IsOptional()
  lots: DetailPlanDto[];
}
