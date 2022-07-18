import {
  IsOptional,
  IsUUID,
  IsString,
  IsNumber,
  UUIDVersion,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePlombDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  conteneur_id: UUIDVersion;

  @ApiProperty()
  @IsString()
  pb_lettre: string;

  @ApiProperty()
  @IsNumber()
  pb_chiffre: number;
}
