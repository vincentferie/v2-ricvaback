import { UUIDVersion } from 'class-validator';

export interface PlombModel {
  id: UUIDVersion;
  conteneur_id: UUIDVersion;
  pb_lettre: string;
  pb_chiffre: number;
}
