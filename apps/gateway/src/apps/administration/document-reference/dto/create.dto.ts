import { TypeDocumentNantissement } from '@app/saas-component/helpers/enums';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
  UUIDVersion,
} from 'class-validator';

export class CreateDocumentRefDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsString()
  @IsOptional()
  refCode: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  destinateur: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  destinataire: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  responsable: string;

  @ApiProperty()
  @IsOptional()
  file: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: TypeDocumentNantissement;
}
