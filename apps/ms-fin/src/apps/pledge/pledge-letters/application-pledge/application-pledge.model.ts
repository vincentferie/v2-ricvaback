import { UUIDVersion } from 'class-validator';

export interface ApplicationPledgeModel {
  id: UUIDVersion;
  processus_id: UUIDVersion;
  ref: string;
  destination: string;
  nbr_sacs: number;
  poids: number;
  valeur_total: number;
}
