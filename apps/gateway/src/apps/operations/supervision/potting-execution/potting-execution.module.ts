import { Module } from '@nestjs/common';
import { PottingExecutionController } from './potting-execution.controller';

@Module({
  controllers: [PottingExecutionController],
  providers: [],
})
export class PottingExecutionModule {}
