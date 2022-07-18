import { UUIDVersion } from 'class-validator';

export interface MenuModel {
  id: UUIDVersion;
  module_id: UUIDVersion;
  libelle: string;
  frontend: string;
}
