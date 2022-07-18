import { BookingModule } from '../../apps/booking/booking.module';
import { ContainerModule } from '../../apps/container/container.module';
import { LotsModule } from '../../apps/lots/lots.module';
import { PottingExecutionModule } from '../../apps/potting-execution/potting-execution.module';
import { UnloadingModule } from '../../apps/unloading/unloading.module';
import { TenancyModule } from '../../public/tenancy.module';

export const moduleApps = [
  TenancyModule,
  BookingModule,
  ContainerModule,
  LotsModule,
  PottingExecutionModule,
  UnloadingModule,
];
