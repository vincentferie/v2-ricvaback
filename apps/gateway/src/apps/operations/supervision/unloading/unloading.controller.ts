import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUnloadingDto, UpdateUnloadingDto } from './dto';
import { UUIDVersion } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  msSUP,
  otherPattern,
  unloadingPattern,
} from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { Sending } from '@app/saas-component/helpers/functions';
import { AuthGuard } from '@nestjs/passport';
import { ReportWarnDto } from '@app/saas-component/helpers/dto';

@ApiBearerAuth()
@ApiTags('unloading')
@Controller('unloading')
export class UnloadingController {
  constructor(@Inject(msSUP) private readonly clientService: ClientProxy) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiBody({ type: CreateUnloadingDto })
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file'))
  async save(
    @Body() _body: CreateUnloadingDto,
    @UploadedFile() file: Express.Multer.File,
    @GetPayload() payload: IRmqPayload<CreateUnloadingDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, unloadingPattern[0]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/edit/:uuid')
  @ApiBody({ type: UpdateUnloadingDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async update(
    @Body() _body: UpdateUnloadingDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<UpdateUnloadingDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, unloadingPattern[1]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async delete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, unloadingPattern[2]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/softdelete/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async softDelete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, unloadingPattern[3]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/restore/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async restore(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, unloadingPattern[4]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, unloadingPattern[5]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('paginate')
  async findPaginate(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateUnloadingDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, unloadingPattern[6]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('paginate/query')
  async findPaginateResearch(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateUnloadingDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, unloadingPattern[7]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('delete')
  async findDeleted(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, unloadingPattern[8]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('existing')
  async findCompletion(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, unloadingPattern[9]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('unused')
  async findUnused(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, unloadingPattern[11]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':uuid')
  async findById(
    @Query() _findOption: any,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, unloadingPattern[10]);
  }

  // Report an error
  @UseGuards(AuthGuard('jwt'))
  @Post('report-warn')
  @ApiBody({ type: ReportWarnDto })
  @UsePipes(ValidationPipe)
  async report(
    @Body() _body: ReportWarnDto,
    @GetPayload() payload: IRmqPayload<ReportWarnDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, otherPattern[0]);
  }

  @Get('/download/:filename')
  @Header('Content-type', 'application/pdf')
  // @Roles(Role.Manager, Role.Viewer, Role.Operator)
  async dowloadFile(@Param('filename') filename: string, @Res() res) {
    return res.status(202).sendFile(filename, {
      root: './uploads/unloading',
    });
  }
}
