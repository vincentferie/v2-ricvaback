import { UUIDVersion } from 'class-validator';
import { DetailsExecutionModel } from './detail/detail-execution.model';

export interface PottingExecutionModel {
  id: UUIDVersion;
  plan_empotage_id: UUIDVersion;
  conteneur_id: UUIDVersion;
  details: DetailsExecutionModel[];
}
