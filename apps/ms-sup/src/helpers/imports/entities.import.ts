import { BookingEntity } from '../../apps/booking/booking.entity';
import { FileBookingEntity } from '../../apps/booking/file/file-booking.entity';
import { ContainerEntity } from '../../apps/container/container.entity';
import { PlombEntity } from '../../apps/container/plomb/plomb.entity';
import { AccountEntity } from '../../apps/externe/account.entity';
import { TenantCampagneEntity } from '../../apps/externe/campagne.entity';
import { DetailBlEntity } from '../../apps/externe/detail-bl.entity';
import { ExporterEntity } from '../../apps/externe/exporter.entity';
import { ForwarderEntity } from '../../apps/externe/forwarder.entity';
import { ContainerPottingPlanEntity } from '../../apps/externe/potting-plan-container.entity';
import { LotPottingPlanEntity } from '../../apps/externe/potting-plan-lots.entity';
import { PottingPlanEntity } from '../../apps/externe/potting-plan.entity';
import { ReportWarnEntity } from '../../apps/externe/report.entity';
import { SpecificityEntity } from '../../apps/externe/specificity.entity';
import { WarehousesEntity } from '../../apps/externe/warehouses.entity';
import { AnalysesEntity } from '../../apps/lots/analyse/analyse.entity';
import { BalanceEntity } from '../../apps/lots/balance/balance.entity';
import { CessionEntity } from '../../apps/lots/cession/cession.entity';
import { FileTicketEntity } from '../../apps/lots/file/file-ticket-pesee.entity';
import { LotEntity } from '../../apps/lots/lot.entity';
import { SweepEntity } from '../../apps/lots/sweep/sweep.entity';
import { TransfertEntity } from '../../apps/lots/transfert/transfert.entity';
import { DetailsExecutionEntity } from '../../apps/potting-execution/detail/detail-execution.entity';
import { PottingExecutionEntity } from '../../apps/potting-execution/potting-execution.entity';
import { FileUnloadingEntity } from '../../apps/unloading/file-unloading/file-unloading.entity';
import { UnloadingEntity } from '../../apps/unloading/unloading.entity';

export const Entities = [
  TenantCampagneEntity,
  BookingEntity,
  FileBookingEntity,
  ContainerEntity,
  PlombEntity,
  AccountEntity,
  ContainerPottingPlanEntity,
  LotPottingPlanEntity,
  PottingPlanEntity,
  WarehousesEntity,
  LotEntity,
  AnalysesEntity,
  BalanceEntity,
  CessionEntity,
  FileTicketEntity,
  SweepEntity,
  TransfertEntity,
  PottingExecutionEntity,
  DetailsExecutionEntity,
  UnloadingEntity,
  FileUnloadingEntity,
  ExporterEntity,
  SpecificityEntity,
  ReportWarnEntity,
  ForwarderEntity,
  DetailBlEntity,
];
