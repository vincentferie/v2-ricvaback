import {
  IsOptional,
  IsUUID,
  UUIDVersion,
  IsNumber,
  IsDate,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MovementDto } from '../../dto/movement.dto';

export class SubBankAccompteDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  compte_banque_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsString()
  num_ref: string;

  @ApiProperty()
  @IsString()
  libelle: string;

  @ApiProperty()
  @IsNumber()
  solde: number;

  @ApiProperty({
    type: Date,
    description: 'Date de création',
  })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    type: MovementDto,
    description: 'Movement opération',
  })
  @IsOptional()
  mouvement: MovementDto;
}
