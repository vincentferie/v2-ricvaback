import {
  IsOptional,
  IsUUID,
  IsEnum,
  IsInt,
  IsString,
  IsNotEmpty,
  UUIDVersion,
} from 'class-validator';
import { StateBooking } from '@app/saas-component/helpers/enums';
export class CreateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsString()
  @IsNotEmpty()
  numero_reel: string;

  @IsString()
  @IsOptional()
  numero_change: string;

  @IsOptional()
  @IsEnum(StateBooking)
  @IsInt()
  state: StateBooking;

  @IsOptional()
  file: any;
}
