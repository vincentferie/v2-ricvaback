import { UUIDVersion } from 'class-validator';

export interface FileBillOfLadingModel {
  id: UUIDVersion;
  bill_lading_id: UUIDVersion;
  filename: string;
  path: string;
  aws_id: number;
}
