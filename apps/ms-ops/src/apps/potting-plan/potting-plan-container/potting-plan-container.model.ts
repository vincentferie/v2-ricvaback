import { UUIDVersion } from 'class-validator';

export interface ContainerPottingPlanModel {
  id: UUIDVersion;
  plan_empotage_id: UUIDVersion;
  conteneur_id: UUIDVersion;
}
