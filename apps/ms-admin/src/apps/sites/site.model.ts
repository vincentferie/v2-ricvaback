import { UUIDVersion } from 'class-validator';
import { Double } from 'typeorm';

export interface SiteModel {
  id: UUIDVersion;
  ville_id: UUIDVersion;
  libelle: string;
  superficie: Double;
  coordonneex: Double;
  coordonneey: Double;
}
