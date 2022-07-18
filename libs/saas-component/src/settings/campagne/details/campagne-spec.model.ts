import { UUIDVersion } from 'class-validator';
import { Double } from 'typeorm';

export interface CampagneSpecModel {
  id: UUIDVersion;
  campagne_id: UUIDVersion;
  libelle: string;
  valeur: Double;
  tag: string;
}
