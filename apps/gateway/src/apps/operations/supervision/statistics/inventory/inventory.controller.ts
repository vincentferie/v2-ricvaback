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
export class InventoryController {
  constructor(@Inject(msSTC) private readonly clientService: ClientProxy) {}

  @Get('/inventory/etat-lots-analyse-detailles')
  async etatLotsAnalyseDetailles(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[0]);
  }

  @Get('/inventory/etat-lots-analyse-generale')
  async etatLotsAnalyseGenerale(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[1]);
  }

  @Get('/inventory/etat-lots-analyse-nantis')
  async etatLotsAnalyseNantis(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[2]);
  }

  @Get('/inventory/etat-statut-lots-analyse')
  async etatStatutLotsAnalyse(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[3]);
  }

  @Get('/inventory/etat-lots-analyse-exportateur')
  async etatLotsAnalyseExportateur(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[4]);
  }

  @Get('/inventory/inventaire-lots-exportateur')
  async inventaireLotsExportateur(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, opsStatsPattern[5]);
  }
}
