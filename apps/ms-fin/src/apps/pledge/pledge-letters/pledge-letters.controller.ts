import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateDto, UpdateDto } from './dto';
import {
  RmqPayloadBodyPipe,
  RmqPayloadParamsPipe,
  RmqPayloadQueryPipe,
} from '@app/saas-component/helpers/pipes';
import { IRmqInput } from '@app/saas-component/helpers/interfaces';
import { applyPledgePattern } from '@app/saas-component';
import { PledgeProcessingService } from './pre-financing.service';

@Controller('application-pledge')
export class PledgeProcessingController {
  private readonly logger = new Logger(PledgeProcessingController.name);

  constructor(private readonly service: PledgeProcessingService) {}

  // @MessagePattern({ cmd: applyPledgePattern[0] })
  // async save(
  //   @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<CreateDto>,
  // ): Promise<any> {
  //   return this.service.save(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[1] })
  // async update(
  //   @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  // ): Promise<any> {
  //   return this.service.update(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[2] })
  // async delete(
  //   @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  // ): Promise<any> {
  //   return this.service.delete(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[3] })
  // async softDelete(
  //   @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  // ): Promise<any> {
  //   return this.service.softDelete(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[4] })
  // async restore(
  //   @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<any>,
  // ): Promise<any> {
  //   return this.service.restore(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[5] })
  // async findAll(
  //   @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  // ): Promise<any> {
  //   return this.service.findAll(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[6] })
  // async findPaginate(
  //   @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  // ): Promise<any> {
  //   return this.service.findPaginate(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[7] })
  // async findPaginateResearch(
  //   @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  // ): Promise<any> {
  //   return this.service.findPaginateResearch(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[8] })
  // async findDeleted(
  //   @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  // ): Promise<any> {
  //   return this.service.findDeleted(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[9] })
  // async findCompletion(
  //   @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  // ): Promise<any> {
  //   return this.service.findCompletion(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[10] })
  // async findById(
  //   @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  // ): Promise<any> {
  //   return this.service.findById(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[11] })
  // async genPdfAnalysis(
  //   @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<any>,
  // ): Promise<any> {
  //   return this.service.genPdfAnalysis(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[12] })
  // async genPdfApplication(
  //   @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<any>,
  // ): Promise<any> {
  //   return this.service.genPdfApplication(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[13] })
  // async genPdfDraw(
  //   @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<any>,
  // ): Promise<any> {
  //   return this.service.genPdfDraw(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[14] })
  // async genPdfRelease(
  //   @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<any>,
  // ): Promise<any> {
  //   return this.service.genPdfRelease(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[15] })
  // async updateAnalysis(
  //   @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  // ): Promise<any> {
  //   return this.service.updateAnalysis(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[16] })
  // async updateApplication(
  //   @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  // ): Promise<any> {
  //   return this.service.updateApplication(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[17] })
  // async updateDraw(
  //   @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  // ): Promise<any> {
  //   return this.service.updateDraw(message);
  // }

  // @MessagePattern({ cmd: applyPledgePattern[18] })
  // async updateRelease(
  //   @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  // ): Promise<any> {
  //   return this.service.updateRelease(message);
  // }

}
