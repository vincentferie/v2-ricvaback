import { UUIDVersion } from 'class-validator';

export interface SousMenuModel {
  id: UUIDVersion;
  menu_id: UUIDVersion;
  libelle: string;
  frontend: string;
}
