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

export class CreateLotsBalanceDto {
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
  entrepot_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  campagne_id: UUIDVersion;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  nbr_sacs: number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
