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
import { msADM, campagnePattern } from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { Sending } from '@app/saas-component/helpers/functions';
import { AuthGuard } from '@nestjs/passport';
import { CreateCampagneDto, UpdateCampagneDto } from './dto';

@ApiBearerAuth()
@ApiTags('campagne')
@Controller('campagne')
@UseGuards(AuthGuard('jwt'))
export class CampagneController {
  constructor(@Inject(msADM) private readonly clientService: ClientProxy) {}

  @Post()
  @ApiBody({ type: CreateCampagneDto })
  @UsePipes(ValidationPipe)
  async save(
    @Body() _body: CreateCampagneDto,
    @GetPayload()
    payload: IRmqPayload<CreateCampagneDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, campagnePattern[0]);
  }

  @Patch('/edit/:uuid')
  @ApiBody({
    type: UpdateCampagneDto,
    description: 'Path id value UUID',
  })
  @UsePipes(ValidationPipe)
  async update(
    @Body() _body: UpdateCampagneDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload()
    payload: IRmqPayload<UpdateCampagneDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, campagnePattern[1]);
  }

  @Delete(':uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async delete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, campagnePattern[2]);
  }

  @Delete('/softdelete/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async softDelete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, campagnePattern[3]);
  }

  @Patch('/restore/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async restore(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, campagnePattern[4]);
  }

  @Get()
  async findAll(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, campagnePattern[5]);
  }

  @Get('paginate')
  async findPaginate(
    @Query() _findOption: any,
    @GetPayload()
    payload: IRmqPayload<UpdateCampagneDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, campagnePattern[6]);
  }

  @Get('paginate/query')
  async findPaginateResearch(
    @Query() _findOption: any,
    @GetPayload()
    payload: IRmqPayload<UpdateCampagneDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, campagnePattern[7]);
  }

  @Get('delete')
  async findDeleted(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, campagnePattern[8]);
  }

  @Get('existing')
  async findCompletion(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, campagnePattern[9]);
  }

  @Get('no-closed')
  async findUnClosed(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, campagnePattern[11]);
  }

  @Get(':uuid')
  async findById(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, campagnePattern[10]);
  }
}
