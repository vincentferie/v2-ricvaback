import { UUIDVersion } from 'class-validator';

export interface FileDrawRequestModel {
  id: UUIDVersion;
  demande_relache_id: UUIDVersion;
  filename: string;
  path: string;
  aws_id: number;
}
