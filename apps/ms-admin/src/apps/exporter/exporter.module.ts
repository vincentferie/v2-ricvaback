import { Module } from '@nestjs/common';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { ExporterController } from './exporter.controller';
import { ExporterService } from './exporter.service';

@Module({
  imports: [MainComponentModule],
  controllers: [ExporterController],
  providers: [ExporterService, VerifUser],
})
export class ExporterModule {}
