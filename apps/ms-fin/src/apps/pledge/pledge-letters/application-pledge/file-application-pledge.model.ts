import { UUIDVersion } from 'class-validator';

export interface FileApplicationPledgeModel {
  id: UUIDVersion;
  demande_nantissement_id: UUIDVersion;
  filename: string;
  path: string;
  aws_id: number;
}
