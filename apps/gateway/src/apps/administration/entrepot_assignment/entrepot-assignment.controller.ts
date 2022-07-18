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
import {
  CreateEntrepotAssignmentDto,
  UpdateEntrepotAssignmentDto,
} from './dto';
import { UUIDVersion } from 'class-validator';
import {
  assignmentsEntrepotPattern,
  msADM,
} from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { Sending } from '@app/saas-component/helpers/functions';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('entrepot-assignment')
@Controller('entrepot-assignment')
@UseGuards(AuthGuard('jwt'))
export class EntrepotAssignmentController {
  constructor(@Inject(msADM) private readonly clientService: ClientProxy) {}

  @Post()
  @ApiBody({ type: CreateEntrepotAssignmentDto })
  @UsePipes(ValidationPipe)
  async save(
    @Body() _body: CreateEntrepotAssignmentDto,
    @GetPayload()
    payload: IRmqPayload<CreateEntrepotAssignmentDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, assignmentsEntrepotPattern[0]);
  }

  @Patch('/edit/:uuid')
  @ApiBody({
    type: UpdateEntrepotAssignmentDto,
    description: 'Path id value UUID',
  })
  @UsePipes(ValidationPipe)
  async update(
    @Body() _body: UpdateEntrepotAssignmentDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload()
    payload: IRmqPayload<UpdateEntrepotAssignmentDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, assignmentsEntrepotPattern[1]);
  }

  @Delete(':uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async delete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, assignmentsEntrepotPattern[2]);
  }

  @Delete('/softdelete/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async softDelete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, assignmentsEntrepotPattern[3]);
  }

  @Patch('/restore/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async restore(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, assignmentsEntrepotPattern[4]);
  }

  @Get()
  async findAll(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, assignmentsEntrepotPattern[5]);
  }

  @Get('paginate')
  async findPaginate(
    @Query() _findOption: any,
    @GetPayload()
    payload: IRmqPayload<UpdateEntrepotAssignmentDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, assignmentsEntrepotPattern[6]);
  }

  @Get('paginate/query')
  async findPaginateResearch(
    @Query() _findOption: any,
    @GetPayload()
    payload: IRmqPayload<UpdateEntrepotAssignmentDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, assignmentsEntrepotPattern[7]);
  }

  @Get('delete')
  async findDeleted(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, assignmentsEntrepotPattern[8]);
  }

  @Get(':uuid')
  async findById(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, assignmentsEntrepotPattern[9]);
  }

  @Get('/user/:uuid')
  async findByUser(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, assignmentsEntrepotPattern[10]);
  }
}
