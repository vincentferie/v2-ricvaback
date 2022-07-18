import { TypeDocumentNantissement } from '@app/saas-component/helpers/enums';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
  UUIDVersion,
} from 'class-validator';

export class CreateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsString()
  @IsOptional()
  refCode: string;

  @IsString()
  @IsOptional()
  destinateur: string;

  @IsString()
  @IsOptional()
  destinataire: string;

  @IsString()
  @IsNotEmpty()
  responsable: string;

  @IsOptional()
  file: any;

  @IsString()
  @IsNotEmpty()
  type: TypeDocumentNantissement;
}
