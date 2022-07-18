import {
  IsOptional,
  IsUUID,
  IsString,
  UUIDVersion,
  IsNumber,
  IsDate,
  IsNotEmpty,
  IsEnum,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { StateTirage } from '@app/saas-component/helpers/enums';
import { MovementDto } from '../../dto/movement.dto';

export class CreatePreFinancingDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  campagne_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  compte_banque_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  sous_compte_banque_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  exportateur_id: UUIDVersion;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  numero: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  solde: number;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  date_tirage: Date;

  @ApiProperty()
  @IsOptional()
  @IsEnum(StateTirage)
  @IsInt()
  type: StateTirage;

  @ApiProperty()
  @IsOptional()
  mouvement: MovementDto;
}
