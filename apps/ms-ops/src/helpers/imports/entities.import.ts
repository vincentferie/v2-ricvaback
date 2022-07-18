import { BillOfLadingEntity } from '../../apps/bill_of_lading/bl.entity';
import { DetailBlEntity } from '../../apps/bill_of_lading/details-bl/detail-bl.entity';
import { FileBillOfLadingEntity } from '../../apps/bill_of_lading/file-bl/file-bl.entity';
import { AccountEntity } from '../../apps/externe/account.entity';
import { AnalysesEntity } from '../../apps/externe/analyse.entity';
import { BookingEntity } from '../../apps/externe/booking.entity';
import { TenantCampagneEntity } from '../../apps/externe/campagne.entity';
import { ContainerEntity } from '../../apps/externe/container.entity';
import { DetailsExecutionEntity } from '../../apps/externe/detail-execution.entity';
import { ExporterEntity } from '../../apps/externe/exporter.entity';
import { FileTicketEntity } from '../../apps/externe/file-ticket-pesee.entity';
import { FileUnloadingEntity } from '../../apps/externe/file-unloading.entity';
import { ForwarderEntity } from '../../apps/externe/forwarder.entity';
import { LotEntity } from '../../apps/externe/lot.entity';
import { PlombEntity } from '../../apps/externe/plomb.entity';
import { PottingExecutionEntity } from '../../apps/externe/potting-execution.entity';
import { ReportWarnEntity } from '../../apps/externe/report.entity';
import { SpecificityEntity } from '../../apps/externe/specificity.entity';
import { UnloadingEntity } from '../../apps/externe/unloading.entity';
import { WarehousesEntity } from '../../apps/externe/warehouses.entity';
import { ContainerPottingPlanEntity } from '../../apps/potting-plan/potting-plan-container/potting-plan-container.entity';
import { LotPottingPlanEntity } from '../../apps/potting-plan/potting-plan-lots/potting-plan-lots.entity';
import { PottingPlanEntity } from '../../apps/potting-plan/potting-plan.entity';

export const Entities = [
  TenantCampagneEntity,
  PottingPlanEntity,
  PottingExecutionEntity,
  DetailsExecutionEntity,
  ContainerPottingPlanEntity,
  DetailBlEntity,
  BillOfLadingEntity,
  FileBillOfLadingEntity,
  LotPottingPlanEntity,
  UnloadingEntity,
  LotEntity,
  FileUnloadingEntity,
  FileTicketEntity,
  AnalysesEntity,
  ContainerEntity,
  AccountEntity,
  BookingEntity,
  ForwarderEntity,
  PlombEntity,
  WarehousesEntity,
  ExporterEntity,
  ReportWarnEntity,
  SpecificityEntity,
];
