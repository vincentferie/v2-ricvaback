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
export class GeneralReportController {
  constructor(@Inject(msSTC) private readonly clientService: ClientProxy) {}

  @Get('/report-general/repartition-lot-tonnage-site-ville')
  async repartitionLotTonnageSiteVille(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[10]);
  }

  @Get('/report-general/evolution-niveau-stock-journalier')
  async evolutionNiveauStockJournalier(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[11]);
  }

  @Get('/report-general/repartition-tonnage-fonction-exportateurs')
  async repartitionTonnageFonctionExportateurs(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[12]);
  }

  @Get('/report-general/qualite-produits-analyses')
  async qualiteProduitsAnalyses(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[13]);
  }

  @Get('/report-general/repartition-lots')
  async repartitionLots(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[14]);
  }

  @Get('/report-general/repartition-lots-non-analyse-entrepot')
  async repartitionLotsNonAnalyseEntrepot(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[15]);
  }

  @Get('/report-general/repartition-lots-exportateur-entrepot')
  async repartitionLotsExportateurEntrepot(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[16]);
  }
}
