import { Module } from '@nestjs/common';
import { DashboardOpsController } from './dashboad.controller';

@Module({
  controllers: [DashboardOpsController],
  providers: [],
})
export class DashboardOpsModule {}
