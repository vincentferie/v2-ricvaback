import { BankAccountModule } from '../../apps/bank-account/bank-account.module';
import { PreFinancingModule } from '../../apps/pre-financing/pre-financing.module';
import { TenancyModule } from '../../public/tenancy.module';

export const moduleApps = [
  TenancyModule,
  BankAccountModule,
  PreFinancingModule,
];
