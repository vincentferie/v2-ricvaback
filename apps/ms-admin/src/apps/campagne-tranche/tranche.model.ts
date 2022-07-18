import { UUIDVersion } from 'class-validator';
import { Double } from 'typeorm';

export interface CampagneTrancheModel {
  id: UUIDVersion;
  campagne_id: UUIDVersion;
  libelle: string;
  outturn_min: Double;
  outturn_max: Double;
  date_debut: Date;
  date_fin: Double;
  prix: number;
}
