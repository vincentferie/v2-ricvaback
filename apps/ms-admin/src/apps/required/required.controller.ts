import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RmqPayloadQueryPipe } from '@app/saas-component/helpers/pipes';
import { IRmqInput } from '@app/saas-component/helpers/interfaces';
import { requiredPattern } from '@app/saas-component';
import { RequiredService } from './required.service';

@Controller('required')
export class RequiredController {
  private readonly logger = new Logger(RequiredController.name);

  constructor(private readonly service: RequiredService) {}

  @MessagePattern({ cmd: requiredPattern[0] })
  async findCustomer(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findCustomer(message);
  }

  @MessagePattern({ cmd: requiredPattern[1] })
  async findCampagne(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findCampagne(message);
  }

  @MessagePattern({ cmd: requiredPattern[2] })
  async findBank(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findBank(message);
  }

  @MessagePattern({ cmd: requiredPattern[3] })
  async findBankSpec(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findBankSpec(message);
  }

  @MessagePattern({ cmd: requiredPattern[4] })
  async findIncotems(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findIncotems(message);
  }

  @MessagePattern({ cmd: requiredPattern[5] })
  async findTiersDetenteur(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findTiersDetenteur(message);
  }

  @MessagePattern({ cmd: requiredPattern[6] })
  async findProvenance(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findProvenance(message);
  }

  @MessagePattern({ cmd: requiredPattern[7] })
  async findEnum(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findEnum(message);
  }
}
