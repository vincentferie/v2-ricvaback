import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UUIDVersion } from 'class-validator';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { ClientProxy } from '@nestjs/microservices';
import { msADM, requiredPattern } from '@app/saas-component/helpers/constants';
import { Sending } from '@app/saas-component/helpers/functions';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('required')
@Controller('required')
@UseGuards(AuthGuard('jwt'))
export class RequiredController {
  constructor(@Inject(msADM) private readonly clientService: ClientProxy) {}

  // Campagne
  @Get('campagne/:uuid')
  async findCampagne(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, requiredPattern[1]);
  }

  // customer
  @Get('customer')
  async findCustomer(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, requiredPattern[0]);
  }

  // banque
  @Get('bank')
  async findBank(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, requiredPattern[2]);
  }

  // incotems
  @Get('incotems')
  async findIncotems(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, requiredPattern[4]);
  }

  // incotems
  @Get('tier-detenteur')
  async findTiersDetenteur(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, requiredPattern[5]);
  }

  // ville
  @Get('provenance')
  async findProvenance(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, requiredPattern[6]);
  }

  // enum type
  @Get('enum-list')
  async findEnum(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, requiredPattern[7]);
  }

  // banque with spec
  @Get('bank/spec/:uuid')
  async findBankSpec(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, requiredPattern[3]);
  }
}
