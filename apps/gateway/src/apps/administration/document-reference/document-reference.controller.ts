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
import { CreateDocumentRefDto, UpdateDocumentRefDto } from './dto';
import { UUIDVersion } from 'class-validator';
import {
  documentRefPattern,
  msADM,
} from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { Sending } from '@app/saas-component/helpers/functions';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

@ApiBearerAuth()
@ApiTags('document-reference')
@Controller('document-reference')
export class DocumentRefController {
  constructor(@Inject(msADM) private readonly clientService: ClientProxy) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiBody({ type: CreateDocumentRefDto })
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file'))
  async save(
    @Body() _body: CreateDocumentRefDto,
    @UploadedFile() file: Express.Multer.File,
    @GetPayload() payload: IRmqPayload<CreateDocumentRefDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, documentRefPattern[0]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/edit/:uuid')
  @ApiBody({ type: UpdateDocumentRefDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async update(
    @Body() _body: UpdateDocumentRefDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<UpdateDocumentRefDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, documentRefPattern[1]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async delete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, documentRefPattern[2]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/softdelete/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async softDelete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, documentRefPattern[3]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/restore/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async restore(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, documentRefPattern[4]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, documentRefPattern[5]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('paginate')
  async findPaginate(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateDocumentRefDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, documentRefPattern[6]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('paginate/query')
  async findPaginateResearch(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateDocumentRefDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, documentRefPattern[7]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('delete')
  async findDeleted(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, documentRefPattern[8]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('existing')
  async findCompletion(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, documentRefPattern[9]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':uuid')
  async findById(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, documentRefPattern[10]);
  }

  @Get('/download/:filename')
  @Header('Content-type', 'application/pdf')
  // @Roles(Role.Manager, Role.Viewer, Role.Operator)
  async dowloadFile(@Param('filename') filename, @Res() res) {
    return res.status(202).sendFile(filename, {
      root: join(__dirname, './uploads/document-ref'),
    });
  }
}
