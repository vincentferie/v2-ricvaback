import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RmqPayloadQueryPipe } from '@app/saas-component/helpers/pipes';
import { IRmqInput } from '@app/saas-component/helpers/interfaces';
import { opsStatsPattern } from '@app/saas-component';
import { ReportExporterService } from './report-exporter.service';

@Controller('statistics')
export class ReportExporterController {
  private readonly logger = new Logger(ReportExporterController.name);

  constructor(private readonly service: ReportExporterService) {}

  @MessagePattern({ cmd: opsStatsPattern[6] })
  async repartitionLotTonnageSite(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.repartitionLotTonnageSite(message);
  }

  @MessagePattern({ cmd: opsStatsPattern[7] })
  async qualiteProduitsAnalyses(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.qualiteProduitsAnalyses(message);
  }

  @MessagePattern({ cmd: opsStatsPattern[8] })
  async repartitionLots(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.repartitionLots(message);
  }

  @MessagePattern({ cmd: opsStatsPattern[9] })
  async inventaireLotsExportateur(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.inventaireLotsExportateur(message);
  }
}
