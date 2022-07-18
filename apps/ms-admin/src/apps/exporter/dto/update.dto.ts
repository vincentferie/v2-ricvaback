import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
  UUIDVersion,
} from 'class-validator';

export class UpdateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsString()
  @IsNotEmpty()
  raison: string;

  @IsString()
  @IsNotEmpty()
  contribuable: string;

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  postal: string;

  @IsString()
  @IsNotEmpty()
  lieu: string;
}
