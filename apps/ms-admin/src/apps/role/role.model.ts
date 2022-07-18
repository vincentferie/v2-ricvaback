import { UUIDVersion } from 'class-validator';

export interface RoleModel {
  id: UUIDVersion;
  libelle: string;
  created_date: Date;
  created_by: string;
  updated_date: Date;
  updated_by: string;
}
