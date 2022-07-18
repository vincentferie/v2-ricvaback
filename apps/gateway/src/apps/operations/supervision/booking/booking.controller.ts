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
import { CreateBookingDto, UpdateBookingDto } from './dto';
import { UUIDVersion } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { bookingPattern, msSUP } from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { Sending } from '@app/saas-component/helpers/functions';
import { AuthGuard } from '@nestjs/passport';
import { join } from 'path';

@ApiBearerAuth()
@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(@Inject(msSUP) private readonly clientService: ClientProxy) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiBody({ type: CreateBookingDto })
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file'))
  async save(
    @Body() _body: CreateBookingDto,
    @UploadedFile() file: Express.Multer.File,
    @GetPayload() payload: IRmqPayload<CreateBookingDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, bookingPattern[0]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/edit/:uuid')
  @ApiBody({ type: UpdateBookingDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async update(
    @Body() _body: UpdateBookingDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<UpdateBookingDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bookingPattern[1]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async delete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bookingPattern[2]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/softdelete/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async softDelete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bookingPattern[3]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/restore/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async restore(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bookingPattern[4]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, bookingPattern[5]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('paginate')
  async findPaginate(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateBookingDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bookingPattern[6]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('paginate/query')
  async findPaginateResearch(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateBookingDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bookingPattern[7]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('delete')
  async findDeleted(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bookingPattern[8]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('existing')
  async findCompletion(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bookingPattern[9]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('not-closed')
  async findNotClosed(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    console.log(payload);
    return Sending(payload, this.clientService, bookingPattern[11]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':uuid')
  async findById(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bookingPattern[10]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/close/:uuid')
  @ApiBody({ description: 'Close booking' })
  @UsePipes(ValidationPipe)
  async close(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, bookingPattern[12]);
  }

  @Get('/download/:filename')
  @Header('Content-type', 'application/pdf')
  // @Roles(Role.Manager, Role.Viewer, Role.Operator)
  async dowloadFile(@Param('filename') filename, @Res() res) {
    return res.status(202).sendFile(filename, {
      root: join(__dirname, './uploads/booking'),
    });
  }
}
