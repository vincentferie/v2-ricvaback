import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { CreateForwarderDto, UpdateForwarderDto } from './dto';
import { UUIDVersion } from 'class-validator';
import { forwarderPattern, msADM } from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { Sending } from '@app/saas-component/helpers/functions';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('forwarder')
@Controller('forwarder')
@UseGuards(AuthGuard('jwt'))
export class ForwarderController {
  constructor(@Inject(msADM) private readonly clientService: ClientProxy) {}

  @Post()
  @ApiBody({ type: CreateForwarderDto })
  @UsePipes(ValidationPipe)
  async save(
    @Body() _body: CreateForwarderDto,
    @GetPayload() payload: IRmqPayload<CreateForwarderDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, forwarderPattern[0]);
  }

  @Patch('/edit/:uuid')
  @ApiBody({ type: UpdateForwarderDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async update(
    @Body() _body: UpdateForwarderDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<UpdateForwarderDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, forwarderPattern[1]);
  }

  @Delete(':uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async delete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, forwarderPattern[2]);
  }

  @Delete('/softdelete/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async softDelete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, forwarderPattern[3]);
  }

  @Patch('/restore/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async restore(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, forwarderPattern[4]);
  }

  @Get()
  async findAll(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, forwarderPattern[5]);
  }

  @Get('paginate')
  async findPaginate(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateForwarderDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, forwarderPattern[6]);
  }

  @Get('paginate/query')
  async findPaginateResearch(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateForwarderDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, forwarderPattern[7]);
  }

  @Get('delete')
  async findDeleted(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, forwarderPattern[8]);
  }

  @Get('existing')
  async findCompletion(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, forwarderPattern[9]);
  }

  @Get(':uuid')
  async findById(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, forwarderPattern[10]);
  }
}
