import { UUIDVersion } from 'class-validator';

export interface CampagneModel {
  id: UUIDVersion;
  campagne_id: UUIDVersion;
  libelle: string;
  ouverture: Date;
  fermeture: Date;
  state: boolean;
}
