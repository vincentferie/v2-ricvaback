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
import { ClientProxy, ClientRMQ } from '@nestjs/microservices';
import {
  CreateLotDto,
  UpdateLotDto,
  CreateLotsAnalysDto,
  UpdateLotsAnalysDto,
  CreateCessionDto,
  UpdateCessionDto,
  CreateTransfertDto,
  UpdateTransfertDto,
  CreateLotsBalanceDto,
  UpdateLotsBalanceDto,
  CreateSweepDto,
  UpdateSweepDto,
} from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  lotsPattern,
  msSUP,
  otherPattern,
} from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import { Sending } from '@app/saas-component/helpers/functions';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import { UUIDVersion } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import { ReportWarnDto } from '@app/saas-component/helpers/dto';
import { join } from 'path';

@ApiBearerAuth()
@ApiTags('lots')
@Controller('lots')
export class LotsController {
  constructor(@Inject(msSUP) private readonly clientService: ClientProxy) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiBody({ type: CreateLotDto })
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file'))
  async save(
    @Body() _body: CreateLotDto,
    @UploadedFile() file: Express.Multer.File,
    @GetPayload() payload: IRmqPayload<CreateLotDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, lotsPattern[0]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/edit/:uuid')
  @ApiBody({ type: UpdateLotDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async update(
    @Body() _body: UpdateLotDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<UpdateLotDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[1]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async delete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[2]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/softdelete/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async softDelete(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[3]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/restore/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  async restore(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[4]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
    return Sending(payload, this.clientService, lotsPattern[5]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('paginate')
  async findPaginate(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateLotDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[6]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('paginate/query')
  async findPaginateResearch(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<UpdateLotDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[7]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('delete')
  async findDeleted(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[8]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('existing')
  async findCompletion(
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[9]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':uuid')
  async findById(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[10]);
  }

  // @Get('unused')
  // async findUnused(@GetPayload() payload: IRmqPayload<any, any> | boolean) {
  //   return Sending(payload, this.clientService, lotsPattern[11]);
  // }

  /**  Analyse ZONE */
  @UseGuards(AuthGuard('jwt'))
  @Post('analize')
  @ApiBody({ type: CreateLotsAnalysDto, description: 'Analyse des lots' })
  @UsePipes(ValidationPipe)
  async saveAnalyse(
    @Body() _body: CreateLotsAnalysDto,
    @UploadedFile() file: Express.Multer.File,
    @GetPayload() payload: IRmqPayload<CreateLotsAnalysDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, lotsPattern[12]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('analize/edit/:uuid')
  @ApiBody({ type: UpdateLotsAnalysDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async updateAnalyse(
    @Body() _body: UpdateLotsAnalysDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<UpdateLotsAnalysDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[13]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('analize/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async deleteAnalyse(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[14]);
  }

  /**  Transfert ZONE */
  @UseGuards(AuthGuard('jwt'))
  @Post('transfert')
  @ApiBody({ type: CreateTransfertDto, description: 'Transfert des lots' })
  @UsePipes(ValidationPipe)
  async saveTransfert(
    @Body() _body: CreateTransfertDto,
    @UploadedFile() file: Express.Multer.File,
    @GetPayload() payload: IRmqPayload<CreateTransfertDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, lotsPattern[15]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('transfert/edit/:uuid')
  @ApiBody({ type: UpdateTransfertDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async updateTransfert(
    @Body() _body: UpdateTransfertDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<UpdateTransfertDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[16]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('transfert/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async deleteTransfert(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[17]);
  }

  /**  Session ZONE */
  @UseGuards(AuthGuard('jwt'))
  @Post('cession')
  @ApiBody({ type: CreateCessionDto, description: 'Cession des lots' })
  @UsePipes(ValidationPipe)
  async saveSession(
    @Body() _body: CreateCessionDto,
    @UploadedFile() file: Express.Multer.File,
    @GetPayload() payload: IRmqPayload<CreateCessionDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, lotsPattern[18]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('cession/edit/:uuid')
  @ApiBody({ type: UpdateCessionDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async updateSession(
    @Body() _body: UpdateCessionDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<UpdateCessionDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[19]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('cession/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async deleteSession(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[20]);
  }

  /**  Balance ZONE */
  @UseGuards(AuthGuard('jwt'))
  @Post('balance')
  @ApiBody({ type: CreateLotsBalanceDto, description: 'Balance des lots' })
  @UsePipes(ValidationPipe)
  async saveBalance(
    @Body() _body: CreateLotsBalanceDto,
    @UploadedFile() file: Express.Multer.File,
    @GetPayload() payload: IRmqPayload<CreateLotsBalanceDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, lotsPattern[21]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('balance/edit/:uuid')
  @ApiBody({ type: UpdateLotsBalanceDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async updateBalance(
    @Body() _body: UpdateLotsBalanceDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<UpdateLotsBalanceDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[22]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('balance/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async deleteBalance(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[23]);
  }

  /**  Balayure ZONE */
  @UseGuards(AuthGuard('jwt'))
  @Post('sweep')
  @ApiBody({ type: CreateSweepDto, description: 'Balayure des lots' })
  @UsePipes(ValidationPipe)
  async saveBalayure(
    @Body() _body: CreateSweepDto,
    @UploadedFile() file: Express.Multer.File,
    @GetPayload() payload: IRmqPayload<CreateSweepDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, lotsPattern[24]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('sweep/edit/:uuid')
  @ApiBody({ type: UpdateSweepDto, description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async updateBalayure(
    @Body() _body: UpdateSweepDto,
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<UpdateSweepDto, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[25]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('sweep/:uuid')
  @ApiBody({ description: 'Path id value UUID' })
  @UsePipes(ValidationPipe)
  async deleteBalayure(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[26]);
  }

  /** Other */
  @UseGuards(AuthGuard('jwt'))
  @Get('list/no-pledge/:uuid')
  @ApiBody({ description: 'Liste des lots no nantis' })
  async findNoPledge(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[27]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list/no-stuffing/:uuid')
  @ApiBody({ description: 'Liste des lots no empoté' })
  async findNoStuffing(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[28]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list/no-analize/:uuid')
  @ApiBody({ description: 'Liste des lots no analysé' })
  async findNoAnalysis(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[29]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list/no-transfert/:uuid')
  @ApiBody({ description: 'Liste des lots no transféré' })
  async findNoTransfert(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[30]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list/no-cession/:uuid')
  @ApiBody({ description: 'Liste des lots no cedé' })
  async findNoCession(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[31]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list/potting-plan/:uuid')
  @ApiBody({
    description: "Liste des lots selectionnés dans un plan d'empotage pas",
  })
  async findPottingPlan(
    @Param('uuid', ParseUUIDPipe) _uuid: UUIDVersion,
    @Query() _findOption: any,
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ) {
    return Sending(payload, this.clientService, lotsPattern[32]);
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
    return Sending(payload, this.clientService, otherPattern[1]);
  }

  @Get('/download/:filename')
  @Header('Content-type', 'application/pdf')
  // @Roles(Role.Manager, Role.Viewer, Role.Operator)
  async dowloadFile(@Param('filename') filename, @Res() res) {
    return res.status(202).sendFile(filename, {
      root: join(__dirname, './uploads/lots'),
    });
  }
}
