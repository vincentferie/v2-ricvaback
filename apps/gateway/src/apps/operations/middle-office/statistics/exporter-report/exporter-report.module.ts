import { Module } from '@nestjs/common';
import { ExporterReportController } from './exporter-report.controller';

@Module({
  controllers: [ExporterReportController],
  providers: [],
})
export class ExporterReportModule {}
