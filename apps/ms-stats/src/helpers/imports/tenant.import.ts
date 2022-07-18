import { ReportGeneralModule } from '../../apps/general-report/general-report.module';
import { InventoryModule } from '../../apps/inventory/inventory.module';
import { ReportExporterModule } from '../../apps/report-exporter/report-exporter.module';
import { TenancyModule } from '../../public/tenancy.module';

export const moduleApps = [
  TenancyModule,
  InventoryModule,
  ReportExporterModule,
  ReportGeneralModule,
];
