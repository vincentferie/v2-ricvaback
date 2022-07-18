import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
  UUIDVersion,
  IsNumber,
} from 'class-validator';
import { Double } from 'typeorm';

export class CreateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsUUID()
  campagne_id: UUIDVersion;

  @IsNumber()
  min_outturn: Double;

  @IsNumber()
  max_outturn: Double;

  @IsString()
  flag: string;
}
