import {
  IsOptional,
  IsUUID,
  IsString,
  UUIDVersion,
  IsNumber,
} from 'class-validator';

export class FileBookingDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  booking_id: UUIDVersion;

  @IsString()
  filename: string;

  @IsString()
  path: string;

  @IsNumber()
  @IsOptional()
  aws_id: number;
}
