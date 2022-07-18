import {
  IsOptional,
  IsUUID,
  IsString,
  IsNumber,
  IsEnum,
  UUIDVersion,
} from 'class-validator';
import { ContainerType } from '@app/saas-component/helpers/enums';
export class UpdateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  booking_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  entrepot_id: UUIDVersion;

  @IsString()
  numero: string;

  @IsString()
  @IsEnum(ContainerType)
  @IsString()
  @IsOptional()
  type_tc: ContainerType;

  @IsNumber()
  @IsOptional()
  capacite: number;
}
