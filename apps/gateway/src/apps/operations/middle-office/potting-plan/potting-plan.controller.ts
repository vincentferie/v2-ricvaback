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
  msOPS,
  pottingPlanPattern,
} from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { Sending } from '@app/saas-component/helpers/functions';
import { CreatePlanDto, UpdatePlanDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('potting-plan')
@Controller('potting-plan')
@UseGuards(AuthGuard('jwt'))
export class PottingPlanController {
  constructor(@Inject(msOPS) private readonly clientService: ClientProxy) {}

  @Post()
  @ApiBody({ type: CreatePlanDto })
  @UsePipes(ValidationPipe)
  async save(
    @Body() _body: CreatePlanDto,
    @GetPayload() payload: IRmqPayload<CreatePlanDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, pottingPlanPattern[0]);
  }

  @Patch('/edit/:uuid')
  @ApiBody({ type: UpdatePlanDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async update(
    @Body() _body: UpdatePlanDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<UpdatePlanDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingPlanPattern[1]);
  }

  @Delete(':uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async delete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingPlanPattern[2]);
  }

  @Delete('/softdelete/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async softDelete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingPlanPattern[3]);
  }

  @Patch('/restore/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async restore(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingPlanPattern[4]);
  }

  @Get()
  async findAll(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, pottingPlanPattern[5]);
  }

  @Get('paginate')
  async findPaginate(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdatePlanDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingPlanPattern[6]);
  }

  @Get('paginate/query')
  async findPaginateResearch(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdatePlanDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingPlanPattern[7]);
  }

  @Get('delete')
  async findDeleted(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingPlanPattern[8]);
  }

  @Get('existing')
  async findCompletion(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingPlanPattern[9]);
  }

  @Get(':uuid')
  async findById(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingPlanPattern[10]);
  }

  @Patch('/close/:uuid')
  @ApiBody({ type: UpdatePlanDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async close(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<UpdatePlanDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingPlanPattern[11]);
  }

  @Get('/no-closed/:uuid')
  async findNotclosed(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, pottingPlanPattern[12]);
  }
}
