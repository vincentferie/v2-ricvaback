import { UUIDVersion } from 'class-validator';

export interface LotPottingPlanModel {
  id: UUIDVersion;
  plan_empotage_id: UUIDVersion;
  lot_id: UUIDVersion;
  nbr_sacs: number;
}
