import { UUIDVersion } from 'class-validator';

export interface ReleaseRequestModel {
  id: UUIDVersion;
  processus_id: UUIDVersion;
  ltd: string;
  nbr_sacs: number;
  valeur: number;
  tirage: number;
}
