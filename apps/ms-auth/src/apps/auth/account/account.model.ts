import { UUIDVersion } from 'class-validator';
export interface AccountModel {
  id: UUIDVersion;
  role_id: UUIDVersion;
  nom: string;
  prenoms: string;
  contact: string;
  username: string;
  password: string;
  created: Date;
}
