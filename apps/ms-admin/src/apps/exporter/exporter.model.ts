import { UUIDVersion } from 'class-validator';

export interface ExporterModel {
  id: UUIDVersion;
  raison: string;
  contribuable: string;
  contact: string;
  email: string;
  postal: string;
  lieu: string;
}
