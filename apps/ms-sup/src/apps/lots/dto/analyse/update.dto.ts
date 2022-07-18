import {
  IsOptional,
  IsUUID,
  UUIDVersion,
  IsEnum,
  IsInt,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Double } from 'typeorm';

export class UpdateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  lot_id: UUIDVersion;

  @IsNumber()
  @IsNotEmpty()
  out_turn: Double;

  @IsNumber()
  @IsNotEmpty()
  grainage: number;

  @IsNumber()
  @IsNotEmpty()
  th: Double;
}
