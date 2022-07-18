import { IsOptional, IsUUID, IsString, UUIDVersion } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateForwarderDto {
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
