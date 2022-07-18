import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsUUID,
  UUIDVersion,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Double } from 'typeorm';

export class CreateLotsAnalysDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  lot_id: UUIDVersion;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  out_turn: Double;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  grainage: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  th: Double;
}
