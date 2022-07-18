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
  libelle: string;
}
