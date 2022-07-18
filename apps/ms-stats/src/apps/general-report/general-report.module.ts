import { Module } from '@nestjs/common';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { ReportGeneralController } from './general-report.controller';
import { ReportGeneralService } from './general-report.service';

@Module({
  imports: [MainComponentModule],
  controllers: [ReportGeneralController],
  providers: [ReportGeneralService, VerifUser],
})
export class ReportGeneralModule {}
