import { Module } from '@nestjs/common';
import { PottingPlanController } from './potting-plan.controller';

@Module({
  controllers: [PottingPlanController],
  providers: [],
})
export class PottingPlanModule {}
