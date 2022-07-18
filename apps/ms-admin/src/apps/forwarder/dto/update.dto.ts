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
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsString()
  @IsOptional()
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
