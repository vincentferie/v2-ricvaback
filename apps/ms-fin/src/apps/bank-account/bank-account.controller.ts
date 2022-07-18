import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateDto, UpdateDto } from './dto';
import {
  RmqPayloadBodyPipe,
  RmqPayloadParamsPipe,
  RmqPayloadQueryPipe,
} from '@app/saas-component/helpers/pipes';
import { IRmqInput } from '@app/saas-component/helpers/interfaces';
import { bankAccountPattern } from '@app/saas-component';
import { BankAccountService } from './bank-account.service';
import { SubBankAccompteDto } from './dto/sub-bank-account.dto';

@Controller('bank-account')
export class BankAccountController {
  private readonly logger = new Logger(BankAccountController.name);

  constructor(private readonly service: BankAccountService) {}

  @MessagePattern({ cmd: bankAccountPattern[0] })
  async save(
    @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<CreateDto>,
  ): Promise<any> {
    return this.service.save(message);
  }

  // @MessagePattern({ cmd: bankAccountPattern[1] })
  // async update(
  //   @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  // ): Promise<any> {
  //   return this.service.update(message);
  // }

  // @MessagePattern({ cmd: bankAccountPattern[2] })
  // async delete(
  //   @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  // ): Promise<any> {
  //   return this.service.delete(message);
  // }

  @MessagePattern({ cmd: bankAccountPattern[3] })
  async saveSub(
    @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<SubBankAccompteDto>,
  ): Promise<any> {
    return this.service.saveSub(message);
  }

  @MessagePattern({ cmd: bankAccountPattern[4] })
  async updateSub(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<SubBankAccompteDto>,
  ): Promise<any> {
    return this.service.updateSub(message);
  }

  // @MessagePattern({ cmd: bankAccountPattern[5] })
  // async deleteSub(
  //   @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<SubBankAccompteDto>,
  // ): Promise<any> {
  //   return this.service.deleteSub(message);
  // }

  @MessagePattern({ cmd: bankAccountPattern[6] })
  async softDelete(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.softDelete(message);
  }

  @MessagePattern({ cmd: bankAccountPattern[7] })
  async restore(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.restore(message);
  }

  @MessagePattern({ cmd: bankAccountPattern[8] })
  async findAll(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findAll(message);
  }

  @MessagePattern({ cmd: bankAccountPattern[9] })
  async findPaginate(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findPaginate(message);
  }

  @MessagePattern({ cmd: bankAccountPattern[10] })
  async findPaginateResearch(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findPaginateResearch(message);
  }

  @MessagePattern({ cmd: bankAccountPattern[11] })
  async findDeleted(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findDeleted(message);
  }

  @MessagePattern({ cmd: bankAccountPattern[12] })
  async findById(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findById(message);
  }
}
