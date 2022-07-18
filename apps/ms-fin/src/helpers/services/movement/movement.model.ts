import {
  NatureOperation,
  TypeMovement,
} from '@app/saas-component/helpers/enums';
import { UUIDVersion } from 'class-validator';

export interface MovementModel {
  id: UUIDVersion;
  compte_banque_id: UUIDVersion;
  sous_compte_banque_id: UUIDVersion;
  intitule: string;
  solde_en_date: number;
  valeur: number;
  nature: NatureOperation;
  type: TypeMovement;
  date: Date;
}
