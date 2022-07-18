import { Module } from '@nestjs/common';
import { DashboardSupController } from './dashboad.controller';

@Module({
  controllers: [DashboardSupController],
  providers: [],
})
export class DashboardSupModule {}
