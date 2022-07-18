import { UUIDVersion } from 'class-validator';

export interface BaseUrlModel {
  id: UUIDVersion;
  libelle: string;
  url: string;
}
