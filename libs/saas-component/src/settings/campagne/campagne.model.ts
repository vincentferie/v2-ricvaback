import { UUIDVersion } from 'class-validator';
import { Double } from 'typeorm';
import { CampagneSpecModel } from './details/campagne-spec.model';

export interface CampagneModel {
  id: UUIDVersion;
  speculation_id: UUIDVersion;
  libelle: string;
  prix_bord: Double;
  ouverture: Date;
  fermeture: Date;
  details: CampagneSpecModel[];
}
