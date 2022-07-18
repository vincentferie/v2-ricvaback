import { AccountModule } from '../../apps/administration/accounts/account.module';
import { CampagneOutturnModule } from '../../apps/administration/campagne_outturn/campagne-outturn.module';
import { CampagneTrancheModule } from '../../apps/administration/campagne_tranche/campagne-tranche.module';
import { ExporterModule } from '../../apps/administration/exporter/exporter.module';
import { ForwarderModule } from '../../apps/administration/forwarder/forwarder.module';
import { RequiredModule } from '../../apps/administration/required/required.module';
import { RulesModule } from '../../apps/administration/role/rules.module';
import { SiteModule } from '../../apps/administration/sites/site.module';
import { SpecificityModule } from '../../apps/administration/specificity/specificity.module';
import { EntrepotAssignmentModule } from '../../apps/administration/entrepot_assignment/entrepot-assignment.module';
import { WarehousesModule } from '../../apps/administration/warehouses/warehouses.module';
import { AuthModule } from '../../apps/auth/auth.module';
import { BillOfLadingModule } from '../../apps/operations/middle-office/bill_of_lading/bill-of-lading.module';
import { DashboardOpsModule } from '../../apps/operations/middle-office/dashboad/dashboad.module';
import { PottingPlanModule } from '../../apps/operations/middle-office/potting-plan/potting-plan.module';
import { ExporterReportModule } from '../../apps/operations/middle-office/statistics/exporter-report/exporter-report.module';
import { GeneralReportModule } from '../../apps/operations/middle-office/statistics/general-report/general-report.module';
import { LotsValidationModule } from '../../apps/operations/middle-office/validation/lot-validation.module';
import { BookingModule } from '../../apps/operations/supervision/booking/booking.module';
import { ContainerModule } from '../../apps/operations/supervision/container/container.module';
import { DashboardSupModule } from '../../apps/operations/supervision/dashboad/dashboad.module';
import { LotsModule } from '../../apps/operations/supervision/lots/lots.module';
import { PlombsModule } from '../../apps/operations/supervision/plomb/plomb.module';
import { PottingExecutionModule } from '../../apps/operations/supervision/potting-execution/potting-execution.module';
import { InventoryModule } from '../../apps/operations/supervision/statistics/inventory/inventory.module';
import { UnloadingModule } from '../../apps/operations/supervision/unloading/unloading.module';
import { RabbitMqModule } from '../../public/rabbitmq.module';
import { SiteAssignmentModule } from '../../apps/administration/site_assignment/site-assignment.module';
import { BankAccountModule } from '../../apps/financials/bank-account/bank-account.module';
import { PreFinancingModule } from '../../apps/financials/pre-financing/pre-financing.module';
import { DocumentRefModule } from '../../apps/administration/document-reference/document-reference.module';
import { CampagneModule } from '../../apps/administration/campagne/campagne.module';

export const moduleApps = [
  // Global redis
  RabbitMqModule,
  // Authentification
  AuthModule,
  // // Operation
  // // ** Supervision
  UnloadingModule,
  LotsModule,
  BookingModule,
  ContainerModule,
  PlombsModule,
  PottingExecutionModule,
  InventoryModule,
  DashboardSupModule,
  // // ** Middle office
  BillOfLadingModule,
  PottingPlanModule,
  LotsValidationModule,
  ExporterReportModule,
  GeneralReportModule,
  DashboardOpsModule,

  // Financial
  BankAccountModule,
  PreFinancingModule,

  // // Administration
  AccountModule,
  RulesModule,
  ExporterModule,
  RequiredModule,
  SiteModule,
  SpecificityModule,
  EntrepotAssignmentModule,
  SiteAssignmentModule,
  WarehousesModule,
  ForwarderModule,
  CampagneModule,
  CampagneOutturnModule,
  CampagneTrancheModule,
  DocumentRefModule,
];
