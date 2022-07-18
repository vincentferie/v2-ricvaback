import { BankAccountEntity } from '../../apps/bank-account/bank-account.entity';
import { MovementEntity } from '../services/movement/movement.entity';
import { SubBankAccountEntity } from '../../apps/bank-account/sub-account/sub-account.entity';
import { AccountEntity } from '../../apps/externe/account.entity';
import { ExporterEntity } from '../../apps/externe/exporter.entity';
import { PreFinancingEntity } from '../../apps/pre-financing/pre-financing.entity';
import { TenantCampagneEntity } from '../../apps/externe/campagne.entity';

export const Entities = [
  TenantCampagneEntity,
  AccountEntity,
  BankAccountEntity,
  SubBankAccountEntity,
  MovementEntity,
  PreFinancingEntity,
  ExporterEntity,
];
