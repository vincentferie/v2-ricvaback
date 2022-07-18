import { UUIDVersion } from 'class-validator';

export interface FileAnalysisRequestModel {
  id: UUIDVersion;
  demande_analyse_id: UUIDVersion;
  filename: string;
  path: string;
  aws_id: number;
}
