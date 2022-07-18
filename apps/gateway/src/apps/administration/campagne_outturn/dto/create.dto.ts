import {
  IsOptional,
  IsUUID,
  IsString,
  UUIDVersion,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Double } from 'typeorm';

export class CreateCampagneOutturnDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsUUID()
  campagne_id: UUIDVersion;

  @ApiProperty({
    type: Double,
    description: 'float value',
    example: '45.0',
  })
  @IsNumber()
  min_outturn: Double;

  @ApiProperty({
    type: Double,
    description: 'float value',
    example: '45.0',
  })
  @IsNumber()
  max_outturn: Double;

  @ApiProperty({
    description: 'length character is 15',
    example: 'Premium or Normal',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  flag: string;
}
