import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  UUIDVersion,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DetailsExecutionDto } from './detail.dto';
import { Type } from 'class-transformer';

export class CreateExecutionDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty({ type: IsUUID, description: 'ID of Potting plan' })
  @IsUUID()
  plan_empotage_id: UUIDVersion;

  @ApiProperty({ type: IsUUID, description: 'ID of container' })
  @IsUUID()
  @IsNotEmpty()
  conteneur_id: UUIDVersion;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date_execution: Date;

  @ApiProperty({ type: () => [DetailsExecutionDto] })
  @IsNotEmpty()
  details: DetailsExecutionDto[];
}
