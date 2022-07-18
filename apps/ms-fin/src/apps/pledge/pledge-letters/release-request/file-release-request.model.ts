import { UUIDVersion } from 'class-validator';

export interface FileReleaseRequestModel {
  id: UUIDVersion;
  demande_tirage_id: UUIDVersion;
  filename: string;
  path: string;
  aws_id: number;
}
