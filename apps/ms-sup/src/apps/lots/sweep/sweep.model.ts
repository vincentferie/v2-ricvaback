import { UUIDVersion } from 'class-validator';

export interface SweepModel {
  id: UUIDVersion;
  lot_id: UUIDVersion;
  entrepot_id: UUIDVersion;
  campagne_id: UUIDVersion;
  nbr_sacs: number;
  date: Date;
}
