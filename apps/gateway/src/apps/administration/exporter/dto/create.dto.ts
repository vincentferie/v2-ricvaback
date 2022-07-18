import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
  UUIDVersion,
} from 'class-validator';

export class CreateExporterDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  raison: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contribuable: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contact: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postal: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lieu: string;
}
