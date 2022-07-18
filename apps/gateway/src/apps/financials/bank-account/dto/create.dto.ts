import {
  IsOptional,
  IsUUID,
  IsString,
  UUIDVersion,
  IsNumber,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubBankAccompteDto } from './sub-bank-account.dto';
import { MovementDto } from '../../dto/movement.dto';
import { Type } from 'class-transformer';

export class CreateBankAccompteDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsUUID()
  campagne_id: UUIDVersion;

  @ApiProperty()
  @IsUUID()
  banque_id: UUIDVersion;

  @ApiProperty()
  @IsNumber()
  solde: number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    type: [SubBankAccompteDto],
    description: 'List of sub account to added',
  })
  @IsOptional()
  sousCompte: SubBankAccompteDto[];
}
