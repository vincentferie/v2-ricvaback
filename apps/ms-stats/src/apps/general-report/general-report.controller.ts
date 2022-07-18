import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RmqPayloadQueryPipe } from '@app/saas-component/helpers/pipes';
import { IRmqInput } from '@app/saas-component/helpers/interfaces';
import { opsStatsPattern } from '@app/saas-component';
import { ReportGeneralService } from './general-report.service';

@Controller('statistics')
export class ReportGeneralController {
  private readonly logger = new Logger(ReportGeneralController.name);

  constructor(private readonly service: ReportGeneralService) {}

  @MessagePattern({ cmd: opsStatsPattern[10] })
  async repartitionLotTonnageSiteVille(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.repartitionLotTonnageSiteVille(message);
  }

  @MessagePattern({ cmd: opsStatsPattern[11] })
  async evolutionNiveauStockJournalier(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.evolutionNiveauStockJournalier(message);
  }

  @MessagePattern({ cmd: opsStatsPattern[12] })
  async repartitionTonnageFonctionExportateurs(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.repartitionTonnageFonctionExportateurs(message);
  }

  @MessagePattern({ cmd: opsStatsPattern[13] })
  async qualiteProduitsAnalyses(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.qualiteProduitsAnalyses(message);
  }

  @MessagePattern({ cmd: opsStatsPattern[14] })
  async repartitionLots(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.repartitionLots(message);
  }

  @MessagePattern({ cmd: opsStatsPattern[15] })
  async repartitionLotsNonAnalyseEntrepot(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.repartitionLotsNonAnalyseEntrepot(message);
  }

  @MessagePattern({ cmd: opsStatsPattern[16] })
  async repartitionLotsExportateurEntrepot(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.repartitionLotsExportateurEntrepot(message);
  }
}
