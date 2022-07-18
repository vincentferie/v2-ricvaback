import {
  IsOptional,
  IsUUID,
  IsString,
  UUIDVersion,
  IsNumber,
} from 'class-validator';

export class FileUnloadingDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  dechargement_id: UUIDVersion;

  @IsString()
  filename: string;

  @IsString()
  path: string;

  @IsNumber()
  @IsOptional()
  aws_id: number;
}
