import {
  IsOptional,
  IsUUID,
  IsString,
  IsNumber,
  UUIDVersion,
} from 'class-validator';

export class FileTicketDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  lot_id: UUIDVersion;

  @IsString()
  filename: string;

  @IsString()
  path: string;

  @IsNumber()
  @IsOptional()
  aws_id: number;
}
