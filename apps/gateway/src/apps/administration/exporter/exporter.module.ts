import { Module } from '@nestjs/common';
import { ExporterController } from './exporter.controller';

@Module({
  controllers: [ExporterController],
  providers: [],
})
export class ExporterModule {}
