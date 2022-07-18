import { UUIDVersion } from 'class-validator';

export interface TierDetenteursModel {
  id: UUIDVersion;
  raison: string;
}
