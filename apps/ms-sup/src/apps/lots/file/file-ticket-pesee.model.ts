import { UUIDVersion } from 'class-validator';

export interface FileTicketModel {
  id: UUIDVersion;
  lot_id: UUIDVersion;
  filename: string;
  path: string;
  aws_id: number;
}
