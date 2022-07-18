import { BillOfLadingModule } from '../../apps/bill_of_lading/bl.module';
import { PottingPlanModule } from '../../apps/potting-plan/potting-plan.module';
import { LotsValidationModule } from '../../apps/validation/lot-validation.module';
import { TenancyModule } from '../../public/tenancy.module';

export const moduleApps = [
  TenancyModule,
  PottingPlanModule,
  BillOfLadingModule,
  LotsValidationModule,
];
