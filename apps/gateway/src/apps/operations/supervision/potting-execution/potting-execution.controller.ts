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
import {
  msSUP,
  pottingExecutionPattern,
} from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { Sending } from '@app/saas-component/helpers/functions';
import { CreateExecutionDto, UpdateExecutionDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('potting-execution')
@Controller('potting-execution')
@UseGuards(AuthGuard('jwt'))
export class PottingExecutionController {
  constructor(@Inject(msSUP) private readonly clientService: ClientProxy) {}

  @Post()
  @ApiBody({ type: CreateExecutionDto })
  @UsePipes(ValidationPipe)
  async save(
    @Body() _body: [CreateExecutionDto],
    @GetPayload() payload: IRmqPayload<[CreateExecutionDto], any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, pottingExecutionPattern[0]);
  }

  @Patch('/edit/:uuid')
  @ApiBody({ type: UpdateExecutionDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async update(
    @Body() _body: UpdateExecutionDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<UpdateExecutionDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingExecutionPattern[1]);
  }

  @Delete(':uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async delete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingExecutionPattern[2]);
  }

  @Delete('/softdelete/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async softDelete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingExecutionPattern[3]);
  }

  @Patch('/restore/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async restore(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingExecutionPattern[4]);
  }

  @Get()
  async findAll(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, pottingExecutionPattern[5]);
  }

  @Get('paginate')
  async findPaginate(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateExecutionDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingExecutionPattern[6]);
  }

  @Get('paginate/query')
  async findPaginateResearch(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateExecutionDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingExecutionPattern[7]);
  }

  @Get('delete')
  async findDeleted(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingExecutionPattern[8]);
  }

  @Get('existing')
  async findCompletion(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingExecutionPattern[9]);
  }

  @Get(':uuid')
  async findById(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingExecutionPattern[10]);
  }

  @Get('list/lot-execution/:uuid')
  @ApiBody({
    description: 'Liste des nombres de lots restants pour execution.',
  })
  async findLotExecution(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingExecutionPattern[11]);
  }
}
