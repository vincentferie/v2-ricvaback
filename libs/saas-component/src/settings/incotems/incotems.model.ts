import { UUIDVersion } from 'class-validator';

export interface IncotemsModel {
  id: UUIDVersion;
  libelle: string;
  description: string;
}
