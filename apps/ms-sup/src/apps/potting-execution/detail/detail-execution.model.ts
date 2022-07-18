import { UUIDVersion } from 'class-validator';

export interface DetailsExecutionModel {
  id: UUIDVersion;
  plan_execution_id: UUIDVersion;
  lot_id: UUIDVersion;
  nbr_sacs: number;
}
