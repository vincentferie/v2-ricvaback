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
import { CreateBillDto, DetailBlDto, UpdateBillDto } from './dto';
import { UUIDVersion } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  billOfLadingPattern,
  msOPS,
} from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { Sending } from '@app/saas-component/helpers/functions';
import { AuthGuard } from '@nestjs/passport';
import { join } from 'path';

@ApiBearerAuth()
@ApiTags('bill-of-lading')
@Controller('bill-of-lading')
export class BillOfLadingController {
  constructor(@Inject(msOPS) private readonly clientService: ClientProxy) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiBody({ type: CreateBillDto })
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file'))
  async save(
    @Body() _body: CreateBillDto,
    @UploadedFile() file: Express.Multer.File,
    @GetPayload() payload: IRmqPayload<CreateBillDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, billOfLadingPattern[0]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/edit/:uuid')
  @ApiBody({ type: UpdateBillDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async update(
    @Body() _body: UpdateBillDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<UpdateBillDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, billOfLadingPattern[1]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/detail-bill-of-lading/edit/:uuid')
  @ApiBody({ type: DetailBlDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async updateSub(
    @Body() _body: DetailBlDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<DetailBlDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, billOfLadingPattern[2]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async delete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, billOfLadingPattern[3]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/softdelete/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async softDelete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, billOfLadingPattern[4]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/restore/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async restore(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, billOfLadingPattern[5]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, billOfLadingPattern[6]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('paginate')
  async findPaginate(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateBillDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, billOfLadingPattern[7]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('paginate/query')
  async findPaginateResearch(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateBillDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, billOfLadingPattern[8]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('delete')
  async findDeleted(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, billOfLadingPattern[9]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('existing')
  async findCompletion(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, billOfLadingPattern[10]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':uuid')
  async findById(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, billOfLadingPattern[11]);
  }

  // @Get('unused')
  // async findUnused(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
  //   return Sending(payload, this.clientService, billOfLadingPattern[11]);
  // }

  @Get('/download/:filename')
  @Header('Content-type', 'application/pdf')
  // @Roles(Role.Manager, Role.Viewer, Role.Operator)
  async dowloadFile(@Param('filename') filename, @Res() res) {
    return res.status(202).sendFile(filename, {
      root: join(__dirname, './uploads/bill-of-lading'),
    });
  }
}
