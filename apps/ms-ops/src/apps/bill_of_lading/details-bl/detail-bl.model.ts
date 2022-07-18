import { UUIDVersion } from 'class-validator';
import { Double } from 'typeorm';
export interface DetailBlModel {
  id: UUIDVersion;
  bill_lading_id: UUIDVersion;
  conteneur_id: UUIDVersion;
  nbr_sacs: number;
  gross_weight: Double;
  tare: Double;
  measurement: Double;
}
