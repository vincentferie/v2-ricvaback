import { UUIDVersion } from 'class-validator';
import { SubBankAccountModel } from './sub-account/sub-account.model';

export interface BankAccountModel {
  id: UUIDVersion;
  campagne_id: UUIDVersion;
  banque_id: UUIDVersion;
  solde: number;
  date: Date;
  sousCompte: SubBankAccountModel[];
}
