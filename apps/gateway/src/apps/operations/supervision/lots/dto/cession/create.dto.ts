import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsUUID,
  IsDate,
  UUIDVersion,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateCessionDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  lot_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  recevant_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  cedant_id: UUIDVersion;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date_session: Date;
}
