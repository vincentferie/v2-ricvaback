import { UUIDVersion } from 'class-validator';

export interface ExporterModel {
  id: UUIDVersion;
  role_id: UUIDVersion;
  nom: string;
  prenoms: string;
  contact: string;
  username: string;
  password: string;
  salt: string;
}
