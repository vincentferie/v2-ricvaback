import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateDto, UpdateDto } from './dto';
import {
  RmqPayloadBodyPipe,
  RmqPayloadParamsPipe,
  RmqPayloadQueryPipe,
} from '@app/saas-component/helpers/pipes';
import { IRmqInput } from '@app/saas-component/helpers/interfaces';
import { validateLotPattern } from '@app/saas-component/helpers/constants';
import { LotsValidationService } from './lot-validation.service';

@Controller('lots-validation')
export class LotsValidationController {
  private readonly logger = new Logger(LotsValidationController.name);

  constructor(private readonly service: LotsValidationService) {}

  @MessagePattern({ cmd: validateLotPattern[0] })
  async validate(
    @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<CreateDto>,
  ): Promise<any> {
    return this.service.validate(message);
  }

  @MessagePattern({ cmd: validateLotPattern[1] })
  async authorizedUnloading(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.authorizedUnloading(message);
  }

  @MessagePattern({ cmd: validateLotPattern[2] })
  async authorized(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.authorized(message);
  }

  @MessagePattern({ cmd: validateLotPattern[3] })
  async findAll(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findAll(message);
  }

  @MessagePattern({ cmd: validateLotPattern[4] })
  async findPaginate(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findPaginate(message);
  }

  @MessagePattern({ cmd: validateLotPattern[5] })
  async findPaginateResearch(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findPaginateResearch(message);
  }

  @MessagePattern({ cmd: validateLotPattern[6] })
  async findCompletion(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findCompletion(message);
  }

  @MessagePattern({ cmd: validateLotPattern[7] })
  async findById(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findById(message);
  }
}
