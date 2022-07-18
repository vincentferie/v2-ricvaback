import { UUIDVersion } from 'class-validator';

export interface AnalysisRequestModel {
  id: UUIDVersion;
  processus_id: UUIDVersion;
  ref: string;
  nbr_sacs: number;
  poids: number;
  nbre_lots: number;
}
