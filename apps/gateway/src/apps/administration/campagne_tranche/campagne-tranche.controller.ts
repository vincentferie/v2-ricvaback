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
import { UUIDVersion } from 'class-validator';
import { msADM, tranchePattern } from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { Sending } from '@app/saas-component/helpers/functions';
import { AuthGuard } from '@nestjs/passport';
import { CreateCampagneTrancheDto, UpdateCampagneTrancheDto } from './dto';

@ApiBearerAuth()
@ApiTags('campagne-tranche')
@Controller('campagne-tranche')
@UseGuards(AuthGuard('jwt'))
export class CampagneTrancheController {
  constructor(@Inject(msADM) private readonly clientService: ClientProxy) {}

  @Post()
  @ApiBody({ type: CreateCampagneTrancheDto })
  @UsePipes(ValidationPipe)
  async save(
    @Body() _body: CreateCampagneTrancheDto,
    @GetPayload()
    payload: IRmqPayload<CreateCampagneTrancheDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, tranchePattern[0]);
  }

  @Patch('/edit/:uuid')
  @ApiBody({
    type: UpdateCampagneTrancheDto,
    description: 'Path id value UUID',
  })
  @UsePipes(ValidationPipe)
  async update(
    @Body() _body: UpdateCampagneTrancheDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload()
    payload: IRmqPayload<UpdateCampagneTrancheDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, tranchePattern[1]);
  }

  @Delete(':uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async delete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, tranchePattern[2]);
  }

  @Delete('/softdelete/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async softDelete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, tranchePattern[3]);
  }

  @Patch('/restore/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async restore(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, tranchePattern[4]);
  }

  @Get()
  async findAll(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, tranchePattern[5]);
  }

  @Get('paginate')
  async findPaginate(
    @Query() _findOption: any,
    @GetPayload()
    payload: IRmqPayload<UpdateCampagneTrancheDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, tranchePattern[6]);
  }

  @Get('paginate/query')
  async findPaginateResearch(
    @Query() _findOption: any,
    @GetPayload()
    payload: IRmqPayload<UpdateCampagneTrancheDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, tranchePattern[7]);
  }

  @Get('delete')
  async findDeleted(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, tranchePattern[8]);
  }

  @Get('existing')
  async findCompletion(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, tranchePattern[9]);
  }

  @Get(':uuid')
  async findById(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, tranchePattern[10]);
  }
}
