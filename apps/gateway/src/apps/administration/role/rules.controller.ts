import {
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateRoleDto } from './dto';
import { UUIDVersion } from 'class-validator';
import { msADM, rulesPattern } from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { Sending } from '@app/saas-component/helpers/functions';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('rules')
@Controller('rules')
@UseGuards(AuthGuard('jwt'))
export class RulesController {
  constructor(@Inject(msADM) private readonly clientService: ClientProxy) {}

  @Delete('/softdelete/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async softDelete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, rulesPattern[0]);
  }

  @Patch('/restore/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async restore(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, rulesPattern[1]);
  }

  @Get()
  async findAll(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, rulesPattern[2]);
  }

  @Get('paginate')
  async findPaginate(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateRoleDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, rulesPattern[3]);
  }

  @Get('paginate/query')
  async findPaginateResearch(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateRoleDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, rulesPattern[4]);
  }

  @Get('delete')
  async findDeleted(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, rulesPattern[5]);
  }

  @Get('existing')
  async findCompletion(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, rulesPattern[6]);
  }

  @Get(':uuid')
  async findById(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, rulesPattern[7]);
  }
}
