import { Module } from '@nestjs/common';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { ReportExporterController } from './report-exporter.controller';
import { ReportExporterService } from './report-exporter.service';

@Module({
  imports: [MainComponentModule],
  controllers: [ReportExporterController],
  providers: [ReportExporterService, VerifUser],
})
export class ReportExporterModule {}
