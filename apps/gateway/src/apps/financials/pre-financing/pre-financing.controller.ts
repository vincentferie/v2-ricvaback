
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
import { CreatePreFinancingDto, UpdatePreFinancingDto } from './dto';
import { UUIDVersion } from 'class-validator';
import {
  preFinancingPattern,
  msFIN,
} from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { Sending } from '@app/saas-component/helpers/functions';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('pre-financing')
@Controller('pre-financing')
@UseGuards(AuthGuard('jwt'))
export class PreFinancingController {
  constructor(@Inject(msFIN) private readonly clientService: ClientProxy) {}

  @Post()
  @ApiBody({ type: CreatePreFinancingDto })
  @UsePipes(ValidationPipe)
  async save(
    @Body() _body: CreatePreFinancingDto,
    @GetPayload() payload: IRmqPayload<CreatePreFinancingDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, preFinancingPattern[0]);
  }

  @Patch('/edit/:uuid')
  @ApiBody({ type: UpdatePreFinancingDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async update(
    @Body() _body: UpdatePreFinancingDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<UpdatePreFinancingDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, preFinancingPattern[1]);
  }

  // @Delete(':uuid')
  // @ApiBody({ description: 'Path id value UUID' })
  // @UsePipes(ValidationPipe)
  // async delete(
  //   @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
  //   @GetPayload() payload: IRmqPayload<any, any> | boolean,
  // ) {
  //   return Sending(payload, this.clientService, preFinancingPattern[2]);
  // }

  @Delete('/softdelete/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async softDelete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, preFinancingPattern[3]);
  }

  @Patch('/restore/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async restore(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, preFinancingPattern[4]);
  }

  @Get()
  async findAll(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, preFinancingPattern[5]);
  }

  @Get('paginate')
  async findPaginate(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdatePreFinancingDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, preFinancingPattern[6]);
  }

  @Get('paginate/query')
  async findPaginateResearch(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdatePreFinancingDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, preFinancingPattern[7]);
  }

  @Get('delete')
  async findDeleted(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, preFinancingPattern[8]);
  }

  @Get('existing')
  async findCompletion(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, preFinancingPattern[9]);
  }

  @Get(':uuid')
  async findById(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, preFinancingPattern[10]);
  }
}
