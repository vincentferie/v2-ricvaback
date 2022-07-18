import { UUIDVersion } from 'class-validator';

export interface CessionModel {
  id: UUIDVersion;
  lot_id: UUIDVersion;
  recevant_id: UUIDVersion;
  cedant_id: UUIDVersion;
  date_session: Date;
}
