import {
  lotsPattern,
  otherPattern,
} from '@app/saas-component/helpers/constants';
import { IRmqInput } from '@app/saas-component/helpers/interfaces';
import {
  RmqPayloadBodyPipe,
  RmqPayloadParamsPipe,
  RmqPayloadQueryPipe,
} from '@app/saas-component/helpers/pipes';
import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  CreateDto,
  UpdateDto,
  CreateAnalizeDto,
  UpdateAnalizeDto,
  CreateBalanceDto,
  UpdateBalanceDto,
  CreateSweepDto,
  UpdateSweepDto,
  CreateCessionDto,
  UpdateCessionDto,
  CreateTransfertDto,
  UpdateTransfertDto,
} from './dto';
import { LotsService } from './lots.service';

@Controller('lots')
export class LotsController {
  private readonly logger = new Logger(LotsController.name);

  constructor(private readonly service: LotsService) {}

  @MessagePattern({ cmd: lotsPattern[0] })
  async save(
    @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<CreateDto>,
  ): Promise<any> {
    return this.service.save(message);
  }

  @MessagePattern({ cmd: lotsPattern[1] })
  async update(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.update(message);
  }

  @MessagePattern({ cmd: lotsPattern[2] })
  async delete(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.delete(message);
  }

  @MessagePattern({ cmd: lotsPattern[3] })
  async softDelete(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.softDelete(message);
  }

  @MessagePattern({ cmd: lotsPattern[4] })
  async restore(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.restore(message);
  }

  @MessagePattern({ cmd: lotsPattern[5] })
  async findAll(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    return this.service.findAll(message);
  }

  @MessagePattern({ cmd: lotsPattern[6] })
  async findPaginate(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findPaginate(message);
  }

  @MessagePattern({ cmd: lotsPattern[7] })
  async findPaginateResearch(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findPaginateResearch(message);
  }

  @MessagePattern({ cmd: lotsPattern[8] })
  async findDeleted(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findDeleted(message);
  }

  @MessagePattern({ cmd: lotsPattern[9] })
  async findCompletion(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findCompletion(message);
  }

  @MessagePattern({ cmd: lotsPattern[10] })
  async findById(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findById(message);
  }

  // @MessagePattern({ cmd: lotsPattern[11]})
  // async findUnused(
  //   @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  // ): Promise<any> {
  //   return this.service.findUnused(message);
  // }

  @MessagePattern({ cmd: otherPattern[1] })
  async report(
    @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.report(message);
  }

  // Analyse ZONE
  @MessagePattern({ cmd: lotsPattern[12] })
  async saveAnalize(
    @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<CreateAnalizeDto>,
  ): Promise<any> {
    return this.service.saveAnalize(message);
  }

  @MessagePattern({ cmd: lotsPattern[13] })
  async updateAnalize(
    @Payload(new RmqPayloadParamsPipe())
    message: IRmqInput<UpdateAnalizeDto>,
  ): Promise<any> {
    return this.service.updateAnalize(message);
  }

  @MessagePattern({ cmd: lotsPattern[14] })
  async deleteAnalize(
    @Payload(new RmqPayloadParamsPipe())
    message: IRmqInput<UpdateAnalizeDto>,
  ): Promise<any> {
    return this.service.deleteAnalize(message);
  }

  //  Transfert ZONE
  @MessagePattern({ cmd: lotsPattern[15] })
  async saveTransfert(
    @Payload(new RmqPayloadBodyPipe())
    message: IRmqInput<CreateTransfertDto>,
  ): Promise<any> {
    return this.service.saveTransfert(message);
  }

  @MessagePattern({ cmd: lotsPattern[16] })
  async updateTransfert(
    @Payload(new RmqPayloadParamsPipe())
    message: IRmqInput<UpdateTransfertDto>,
  ): Promise<any> {
    return this.service.updateTransfert(message);
  }

  @MessagePattern({ cmd: lotsPattern[17] })
  async deleteTransfert(
    @Payload(new RmqPayloadParamsPipe())
    message: IRmqInput<UpdateTransfertDto>,
  ): Promise<any> {
    return this.service.deleteTransfert(message);
  }

  //  Cession ZONE
  @MessagePattern({ cmd: lotsPattern[18] })
  async saveCession(
    @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<CreateCessionDto>,
  ): Promise<any> {
    return this.service.saveCession(message);
  }

  @MessagePattern({ cmd: lotsPattern[19] })
  async updateCession(
    @Payload(new RmqPayloadParamsPipe())
    message: IRmqInput<UpdateCessionDto>,
  ): Promise<any> {
    return this.service.updateCession(message);
  }

  @MessagePattern({ cmd: lotsPattern[20] })
  async deleteCession(
    @Payload(new RmqPayloadParamsPipe())
    message: IRmqInput<UpdateCessionDto>,
  ): Promise<any> {
    return this.service.deleteCession(message);
  }

  //  Balance ZONE
  @MessagePattern({ cmd: lotsPattern[21] })
  async saveBalance(
    @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<CreateBalanceDto>,
  ): Promise<any> {
    return this.service.saveBalance(message);
  }

  @MessagePattern({ cmd: lotsPattern[22] })
  async updateBalance(
    @Payload(new RmqPayloadParamsPipe())
    message: IRmqInput<UpdateBalanceDto>,
  ): Promise<any> {
    return this.service.updateBalance(message);
  }

  @MessagePattern({ cmd: lotsPattern[23] })
  async deleteBalance(
    @Payload(new RmqPayloadParamsPipe())
    message: IRmqInput<UpdateBalanceDto>,
  ): Promise<any> {
    return this.service.deleteBalance(message);
  }

  //  Balayure ZONE
  @MessagePattern({ cmd: lotsPattern[24] })
  async saveBalayure(
    @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<CreateSweepDto>,
  ): Promise<any> {
    return this.service.saveBalayure(message);
  }

  @MessagePattern({ cmd: lotsPattern[25] })
  async updateBalayure(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateSweepDto>,
  ): Promise<any> {
    return this.service.updateBalayure(message);
  }

  @MessagePattern({ cmd: lotsPattern[26] })
  async deleteBalayure(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateSweepDto>,
  ): Promise<any> {
    return this.service.deleteBalayure(message);
  }

  // Other
  @MessagePattern({ cmd: lotsPattern[27] })
  async findNoPledge(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findNoPledge(message);
  }

  @MessagePattern({ cmd: lotsPattern[28] })
  async findNoStuffing(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findNoStuffing(message);
  }

  @MessagePattern({ cmd: lotsPattern[29] })
  async findNoAnalysis(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findNoAnalysis(message);
  }

  @MessagePattern({ cmd: lotsPattern[30] })
  async findNoTransfert(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findNoTransfert(message);
  }

  @MessagePattern({ cmd: lotsPattern[31] })
  async findNoCession(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findNoCession(message);
  }

  @MessagePattern({ cmd: lotsPattern[32] })
  async findPottingPlan(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findPottingPlan(message);
  }
}
