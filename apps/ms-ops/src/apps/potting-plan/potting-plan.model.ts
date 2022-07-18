import { StateBooking } from '@app/saas-component/helpers/enums';
import { UUIDVersion } from 'class-validator';
import { ContainerPottingPlanModel } from './potting-plan-container/potting-plan-container.model';
import { LotPottingPlanModel } from './potting-plan-lots/potting-plan-lots.model';

export interface PottingPlanModel {
  id: UUIDVersion;
  entrepot_id: UUIDVersion;
  transitaire_id: UUIDVersion;
  numero: string;
  state: StateBooking;
  date_execution: Date;
  conteneurs: ContainerPottingPlanModel[];
  lots: LotPottingPlanModel[];
}
