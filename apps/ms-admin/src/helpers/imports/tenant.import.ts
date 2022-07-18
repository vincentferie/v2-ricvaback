import { AccountsModule } from '../../apps/account/accounts.module';
import { CampagneOutturnModule } from '../../apps/campagne-outturn/outturn.module';
import { CampagneTrancheModule } from '../../apps/campagne-tranche/tranche.module';
import { ExporterModule } from '../../apps/exporter/exporter.module';
import { ForwarderModule } from '../../apps/forwarder/forwarder.module';
import { RequiredModule } from '../../apps/required/required.module';
import { RulesModule } from '../../apps/role/roles.module';
import { SitesModule } from '../../apps/sites/sites.module';
import { SpecificityModule } from '../../apps/specificity/specificity.module';
import { EntrepotAssignmentModule } from '../../apps/entrepot-assignment/entrepot-assignment.module';
import { WarehousesModule } from '../../apps/warehouses/warehouses.module';
import { TenancyModule } from '../../public/tenancy.module';
import { SiteAssignmentModule } from '../../apps/site-assignment/site-assignment.module';
import { CampagneModule } from '../../apps/campagne/campagne.module';

export const moduleApps = [
  TenancyModule,
  AccountsModule,
  ExporterModule,
  RequiredModule,
  SitesModule,
  SpecificityModule,
  WarehousesModule,
  EntrepotAssignmentModule,
  SiteAssignmentModule,
  ForwarderModule,
  CampagneModule,
  CampagneOutturnModule,
  CampagneTrancheModule,
  RulesModule,
];
