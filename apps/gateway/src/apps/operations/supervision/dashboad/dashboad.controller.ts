import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { ClientProxy } from '@nestjs/microservices';
import { dashboardPattern, msDSH } from '@app/saas-component/helpers/constants';
import { Sending } from '@app/saas-component/helpers/functions';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('supervision-board')
@Controller('supervision-board')
@UseGuards(AuthGuard('jwt'))
export class DashboardSupController {
  constructor(@Inject(msDSH) private readonly clientService: ClientProxy) {}

  @Get('/operation')
  async findCustomer(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, dashboardPattern[1]);
  }
}
