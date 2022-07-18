import { UUIDVersion } from 'class-validator';

export interface FileUnloadingModel {
  id: UUIDVersion;
  dechargement_id: UUIDVersion;
  filename: string;
  path: string;
  aws_id: number | null;
}
