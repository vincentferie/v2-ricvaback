import { StateTirage } from '@app/saas-component/helpers/enums';
import { UUIDVersion } from 'class-validator';
import { MovementModel } from '../../helpers/services/movement/movement.model';

export interface PreFinancingModel {
  id: UUIDVersion;
  campagne_id: UUIDVersion;
  compte_banque_id: UUIDVersion;
  sous_compte_banque_id: UUIDVersion;
  exportateur_id: UUIDVersion;
  numero: string;
  solde: number;
  date_tirage: Date;
  type: StateTirage;
  mouvement: MovementModel;
}
