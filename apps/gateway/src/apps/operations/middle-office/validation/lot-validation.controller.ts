import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateLotValidDto } from './dto';
import { UUIDVersion } from 'class-validator';
import {
  msOPS,
  validateLotPattern,
} from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { Sending } from '@app/saas-component/helpers/functions';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('lots-validation')
@Controller('lots-validation')
@UseGuards(AuthGuard('jwt'))
export class LotsValidationController {
  constructor(@Inject(msOPS) private readonly clientService: ClientProxy) {}

  @Patch('/validate')
  @ApiBody({
    type: UpdateLotValidDto,
    description: 'send unload and lot id in body',
  })
  @UsePipes(ValidationPipe)
  async validate(
    @Body() _body: UpdateLotValidDto,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, validateLotPattern[0]);
  }

  @Patch('/autorize/unloading/:uuid')
  @ApiBody({ type: UpdateLotValidDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async authorizedUnloading(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, validateLotPattern[1]);
  }

  @Patch('/autorize/:uuid')
  @ApiBody({ type: UpdateLotValidDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async authorized(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, validateLotPattern[2]);
  }

  @Get()
  async findAll(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, validateLotPattern[3]);
  }

  @Get('paginate')
  async findPaginate(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateLotValidDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, validateLotPattern[4]);
  }

  @Get('paginate/query')
  async findPaginateResearch(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateLotValidDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, validateLotPattern[5]);
  }

  @Get('existing')
  async findCompletion(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, validateLotPattern[6]);
  }

  @Get(':uuid')
  async findById(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, validateLotPattern[7]);
  }
}
