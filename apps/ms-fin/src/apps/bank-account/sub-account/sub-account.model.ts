import { MovementModel } from '../../../helpers/services/movement/movement.model';
import { UUIDVersion } from 'class-validator';

export interface SubBankAccountModel {
  id: UUIDVersion;
  compte_banque_id: UUIDVersion;
  num_ref: string;
  libelle: string;
  solde: number;
  date: Date;
  mouvement: MovementModel;
}
