import { UUIDVersion } from 'class-validator';

export interface DrawRequestModel {
  id: UUIDVersion;
  processus_id: UUIDVersion;
  transitaire_id: UUIDVersion;
  navire: string;
  destination: string;
  port_embarquement: string;
  poids: number;
  valeur_total: number;
}
