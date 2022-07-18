import { UUIDVersion } from 'class-validator';

export interface LotValidationModel {
  dechargement_id: UUIDVersion;
  lot_id: UUIDVersion;
}
