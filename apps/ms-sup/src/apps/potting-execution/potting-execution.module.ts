import { Module } from '@nestjs/common';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { PottingExecutionService } from './potting-execution.service';
import { PottingExecutionController } from './potting-execution.controller';

@Module({
  imports: [],
  controllers: [PottingExecutionController],
  providers: [PottingExecutionService, VerifUser],
})
export class PottingExecutionModule {}
