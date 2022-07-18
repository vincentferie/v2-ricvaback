import { Type } from 'class-transformer';
import {
  IsOptional,
  IsUUID,
  IsDate,
  UUIDVersion,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  lot_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  recevant_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  cedant_id: UUIDVersion;

  @IsDate()
  @Type(() => Date)
  date_session: Date;
}
