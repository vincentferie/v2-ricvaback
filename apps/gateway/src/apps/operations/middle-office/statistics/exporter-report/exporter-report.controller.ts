import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { ClientProxy } from '@nestjs/microservices';
import { msSTC, opsStatsPattern } from '@app/saas-component/helpers/constants';
import { Sending } from '@app/saas-component/helpers/functions';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('statistics')
@Controller('statistics')
@UseGuards(AuthGuard('jwt'))
export class ExporterReportController {
  constructor(@Inject(msSTC) private readonly clientService: ClientProxy) {}

  @Get('/report-exporter/repartition-lot-tonnage-site')
  async repartitionLotTonnageSite(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[6]);
  }

  @Get('/report-exporter/qualite-produits-analyses')
  async qualiteProduitsAnalyses(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[7]);
  }

  @Get('/report-exporter/repartition-lots')
  async repartitionLots(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[8]);
  }

  @Get('/report-exporter/inventaire-lots-exportateur')
  async inventaireLotsExportateur(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[9]);
  }
}
