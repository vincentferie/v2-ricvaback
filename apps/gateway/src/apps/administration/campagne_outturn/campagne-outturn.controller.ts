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
import { CreateCampagneOutturnDto, UpdateCampagneOutturnDto } from './dto';
import { UUIDVersion } from 'class-validator';
import { msADM, outturnPattern } from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { Sending } from '@app/saas-component/helpers/functions';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('campagne-outturn')
@Controller('campagne-outturn')
@UseGuards(AuthGuard('jwt'))
export class CampagneOutturnController {
  constructor(@Inject(msADM) private readonly clientService: ClientProxy) {}

  @Post()
  @ApiBody({ type: CreateCampagneOutturnDto })
  @UsePipes(ValidationPipe)
  async save(
    @Body() _body: CreateCampagneOutturnDto,
    @GetPayload()
    payload: IRmqPayload<CreateCampagneOutturnDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, outturnPattern[0]);
  }

  @Patch('/edit/:uuid')
  @ApiBody({
    type: UpdateCampagneOutturnDto,
    description: 'Path id value UUID',
  })
  @UsePipes(ValidationPipe)
  async update(
    @Body() _body: UpdateCampagneOutturnDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload()
    payload: IRmqPayload<UpdateCampagneOutturnDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, outturnPattern[1]);
  }

  @Delete(':uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async delete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, outturnPattern[2]);
  }

  @Delete('/softdelete/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async softDelete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, outturnPattern[3]);
  }

  @Patch('/restore/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async restore(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, outturnPattern[4]);
  }

  @Get()
  async findAll(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, outturnPattern[5]);
  }

  @Get('paginate')
  async findPaginate(
    @Query() _findOption: any,
    @GetPayload()
    payload: IRmqPayload<UpdateCampagneOutturnDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, outturnPattern[6]);
  }

  @Get('paginate/query')
  async findPaginateResearch(
    @Query() _findOption: any,
    @GetPayload()
    payload: IRmqPayload<UpdateCampagneOutturnDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, outturnPattern[7]);
  }

  @Get('delete')
  async findDeleted(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, outturnPattern[8]);
  }

  @Get('existing')
  async findCompletion(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, outturnPattern[9]);
  }

  @Get(':uuid')
  async findById(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, outturnPattern[10]);
  }
}
