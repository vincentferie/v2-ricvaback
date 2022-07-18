import { Module } from '@nestjs/common';
import { GeneralReportController } from './general-report.controller';

@Module({
  controllers: [GeneralReportController],
  providers: [],
})
export class GeneralReportModule {}
