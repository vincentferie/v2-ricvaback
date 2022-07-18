import {
  IsOptional,
  IsUUID,
  IsString,
  UUIDVersion,
  IsNumber,
} from 'class-validator';

export class FileBillOfLadingDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  bill_lading_id: UUIDVersion;

  @IsString()
  filename: string;

  @IsString()
  path: string;

  @IsNumber()
  @IsOptional()
  aws_id: number;
}
