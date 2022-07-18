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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePlombDto, UpdatePlombDto } from './dto';
import { UUIDVersion } from 'class-validator';
import { containerPattern, msSUP } from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { Sending } from '@app/saas-component/helpers/functions';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('container')
@Controller('container')
@UseGuards(AuthGuard('jwt'))
export class PlombsController {
  constructor(@Inject(msSUP) private readonly clientService: ClientProxy) {}

  @Post('/plomb')
  @ApiBody({ type: CreatePlombDto })
  @UsePipes(ValidationPipe)
  async save(
    @Body() _body: CreatePlombDto,
    @GetPayload() payload: IRmqPayload<CreatePlombDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, containerPattern[15]);
  }

  @Patch('/plomb/edit/:uuid')
  @ApiBody({ type: UpdatePlombDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async update(
    @Body() _body: UpdatePlombDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<UpdatePlombDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, containerPattern[16]);
  }

  @Delete('/plomb/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async delete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, containerPattern[17]);
  }

  @Get('list/no-plomb/:uuid')
  async findByNoPlomb(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, containerPattern[13]);
  }

  @Get('list/plomb/:uuid')
  async findByPlomb(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, containerPattern[14]);
  }

}
