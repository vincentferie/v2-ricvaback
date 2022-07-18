import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RmqPayloadQueryPipe } from '@app/saas-component/helpers/pipes';
import { IRmqInput } from '@app/saas-component/helpers/interfaces';
import { opsStatsPattern } from '@app/saas-component';
import { InventoryService } from './inventory.service';

@Controller('statistics')
export class InventoryController {
  private readonly logger = new Logger(InventoryController.name);

  constructor(private readonly service: InventoryService) {}

  @MessagePattern({ cmd: opsStatsPattern[0] })
  async etatLotsAnalyseDetailles(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.etatLotsAnalyseDetailles(message);
  }

  @MessagePattern({ cmd: opsStatsPattern[1] })
  async etatLotsAnalyseGenerale(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.etatLotsAnalyseGenerale(message);
  }

  @MessagePattern({ cmd: opsStatsPattern[2] })
  async etatLotsAnalyseNantis(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.etatLotsAnalyseNantis(message);
  }

  @MessagePattern({ cmd: opsStatsPattern[3] })
  async etatStatutLotsAnalyse(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.etatStatutLotsAnalyse(message);
  }

  @MessagePattern({ cmd: opsStatsPattern[4] })
  async etatLotsAnalyseExportateur(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.etatLotsAnalyseExportateur(message);
  }

  @MessagePattern({ cmd: opsStatsPattern[5] })
  async inventaireLotsExportateur(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.inventaireLotsExportateur(message);
  }
}
