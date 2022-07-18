import { UUIDVersion } from 'class-validator';

export interface ForwarderModel {
  id: UUIDVersion;
  raison_social: string;
  denomination: string;
  localisation: string;
  contact: string;
}
