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

export class UpdateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  @IsOptional()
  campagne_id: UUIDVersion;

  @IsOptional()
  @IsNumber()
  min_outturn: Double;

  @IsOptional()
  @IsNumber()
  max_outturn: Double;

  @IsOptional()
  @IsString()
  flag: string;
}
