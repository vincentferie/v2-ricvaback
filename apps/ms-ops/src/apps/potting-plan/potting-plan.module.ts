import { Module } from '@nestjs/common';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { PottingPlanService } from './potting-plan.service';
import { PottingPlanController } from './potting-plan.controller';

@Module({
  imports: [],
  controllers: [PottingPlanController],
  providers: [PottingPlanService, VerifUser],
})
export class PottingPlanModule {}
