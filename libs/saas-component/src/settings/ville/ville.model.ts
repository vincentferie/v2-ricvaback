import { UUIDVersion } from 'class-validator';

export interface VilleModel {
  id: UUIDVersion;
  libelle: string;
}
