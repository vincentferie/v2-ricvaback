import { UUIDVersion } from 'class-validator';
import { Double } from 'typeorm';

export interface WarehousesModel {
  id: UUIDVersion;
  site_id: UUIDVersion;
  libelle: string;
  superficie: Double;
  coordonneex: Double;
  coordonneey: Double;
}
