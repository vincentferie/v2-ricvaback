import {
  IsOptional,
  IsUUID,
  IsString,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  UUIDVersion,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContainerType } from '@app/saas-component';
export class CreateContainerDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  booking_id: UUIDVersion;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  entrepot_id: UUIDVersion;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  numero: string;

  @ApiProperty()
  @IsEnum(ContainerType)
  @IsString()
  @IsOptional()
  type_tc: ContainerType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  capacite: number;
}
