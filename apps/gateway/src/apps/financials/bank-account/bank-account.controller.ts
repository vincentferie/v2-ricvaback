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
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateBankAccompteDto,
  SubBankAccompteDto,
  UpdateBankAccompteDto,
} from './dto';
import { UUIDVersion } from 'class-validator';
import {
  bankAccountPattern,
  msFIN,
} from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { Sending } from '@app/saas-component/helpers/functions';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('bank-account')
@Controller('bank-account')
@UseGuards(AuthGuard('jwt'))
export class BankAccountController {
  constructor(@Inject(msFIN) private readonly clientService: ClientProxy) {}

  @Post()
  @ApiBody({ type: CreateBankAccompteDto })
  @UsePipes(ValidationPipe)
  async save(
    @Body() _body: CreateBankAccompteDto,
    @GetPayload() payload: IRmqPayload<CreateBankAccompteDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, bankAccountPattern[0]);
  }

  // @Patch('/edit/:uuid')
  // @ApiBody({ type: UpdateBankAccompteDto, description: 'Path id value UUID' })
  // @UsePipes(ValidationPipe)
  // async update(
  //   @Body() _body: UpdateBankAccompteDto,
  //   @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
  //   @GetPayload() payload: IRmqPayload<UpdateBankAccompteDto, any> | boolean,
  // ) {
  //   return Sending(payload, this.clientService, bankAccountPattern[1]);
  // }

  // @Delete(':uuid')
  // @ApiBody({ description: 'Path id value UUID' })
  // @UsePipes(ValidationPipe)
  // async delete(
  //   @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
  //   @GetPayload() payload: IRmqPayload<any, any> | boolean,
  // ) {
  //   return Sending(payload, this.clientService, bankAccountPattern[2]);
  // }

  @Post('sub-account')
  @ApiBody({ type: SubBankAccompteDto })
  @UsePipes(ValidationPipe)
  async saveSub(
    @Body() _body: SubBankAccompteDto,
    @GetPayload() payload: IRmqPayload<SubBankAccompteDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, bankAccountPattern[3]);
  }

  @Patch('sub-account/edit/:uuid')
  @ApiBody({ type: SubBankAccompteDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async updateSub(
    @Body() _body: SubBankAccompteDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<SubBankAccompteDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bankAccountPattern[4]);
  }

  // @Delete('sub-account/:uuid')
  // @ApiBody({ description: 'Path id value UUID' })
  // @UsePipes(ValidationPipe)
  // async deleteSub(
  //   @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
  //   @GetPayload() payload: IRmqPayload<any, any> | boolean,
  // ) {
  //   return Sending(payload, this.clientService, bankAccountPattern[5]);
  // }

  @Delete('/softdelete/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async softDelete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bankAccountPattern[6]);
  }

  @Patch('/restore/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async restore(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bankAccountPattern[7]);
  }

  @Get()
  async findAll(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, bankAccountPattern[8]);
  }

  @Get('paginate')
  async findPaginate(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateBankAccompteDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bankAccountPattern[9]);
  }

  @Get('paginate/query')
  async findPaginateResearch(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateBankAccompteDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bankAccountPattern[10]);
  }

  @Get('delete')
  async findDeleted(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bankAccountPattern[11]);
  }

  @Get(':uuid')
  async findById(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bankAccountPattern[12]);
  }
}
