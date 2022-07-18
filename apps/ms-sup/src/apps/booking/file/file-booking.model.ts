import { UUIDVersion } from 'class-validator';

export interface FileBookingModel {
  id: UUIDVersion;
  booking_id: UUIDVersion;
  filename: string;
  path: string;
  aws_id: number;
}
