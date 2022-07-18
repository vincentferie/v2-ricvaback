import { UUIDVersion } from 'class-validator';

export interface ReportWarnModel {
  id: UUIDVersion;
  dechargement_id: UUIDVersion;
  lot_id: UUIDVersion;
  superviseur_id: UUIDVersion;
  motif: string;
  text: string;
}
