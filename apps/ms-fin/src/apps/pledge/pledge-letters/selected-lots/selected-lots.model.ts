import { UUIDVersion } from 'class-validator';

export interface PledgeSelectedLotsModel {
  id: UUIDVersion;
  processus_id: UUIDVersion;
  lot_id: UUIDVersion;
}
