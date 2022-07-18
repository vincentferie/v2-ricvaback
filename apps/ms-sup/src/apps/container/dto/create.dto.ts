import {
  IsOptional,
  IsUUID,
  IsString,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  UUIDVersion,
} from 'class-validator';
import { ContainerType } from '@app/saas-component/helpers/enums';
export class CreateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsNotEmpty()
  @IsUUID()
  booking_id: UUIDVersion;

  @IsNotEmpty()
  @IsUUID()
  entrepot_id: UUIDVersion;

  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ContainerType)
  @IsString()
  @IsOptional()
  type_tc: ContainerType;

  @IsNumber()
  @IsOptional()
  capacite: number;
}
