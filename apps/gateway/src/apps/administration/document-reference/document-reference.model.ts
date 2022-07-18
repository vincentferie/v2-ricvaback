import { TypeDocumentNantissement } from '@app/saas-component/helpers/enums';
import { UUIDVersion } from 'class-validator';

export interface DocumentRefModel {
  id: UUIDVersion;
  refCode: string;
  destinateur: string;
  destinataire: string;
  responsable: string;
  file: any;
  type: TypeDocumentNantissement;
}
