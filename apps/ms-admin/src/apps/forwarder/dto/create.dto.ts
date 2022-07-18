import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
  UUIDVersion,
  IsNumber,
} from 'class-validator';

export class CreateDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsString()
  raison_social: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  denomination: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  localisation: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contact: string;
}
