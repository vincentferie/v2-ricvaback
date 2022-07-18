import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateDto, UpdateDto } from './dto';
import {
  RmqPayloadBodyPipe,
  RmqPayloadParamsPipe,
  RmqPayloadQueryPipe,
} from '@app/saas-component/helpers/pipes';
import { IRmqInput } from '@app/saas-component/helpers/interfaces';
import { CampagneTrancheService } from './tranche.service';
import { tranchePattern } from '@app/saas-component/helpers/constants';

@Controller('campagne-tranche')
export class CampagneTrancheController {
  private readonly logger = new Logger(CampagneTrancheController.name);

  constructor(private readonly service: CampagneTrancheService) {}

  @MessagePattern({ cmd: tranchePattern[0] })
  async save(
    @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<CreateDto>,
  ): Promise<any> {
    return this.service.save(message);
  }

  @MessagePattern({ cmd: tranchePattern[1] })
  async update(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.update(message);
  }

  @MessagePattern({ cmd: tranchePattern[2] })
  async delete(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.delete(message);
  }

  @MessagePattern({ cmd: tranchePattern[3] })
  async softDelete(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.softDelete(message);
  }

  @MessagePattern({ cmd: tranchePattern[4] })
  async restore(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.restore(message);
  }

  @MessagePattern({ cmd: tranchePattern[5] })
  async findAll(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findAll(message);
  }

  @MessagePattern({ cmd: tranchePattern[6] })
  async findPaginate(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findPaginate(message);
  }

  @MessagePattern({ cmd: tranchePattern[7] })
  async findPaginateResearch(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findPaginateResearch(message);
  }

  @MessagePattern({ cmd: tranchePattern[8] })
  async findDeleted(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findDeleted(message);
  }

  @MessagePattern({ cmd: tranchePattern[9] })
  async findCompletion(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findCompletion(message);
  }

  @MessagePattern({ cmd: tranchePattern[10] })
  async findById(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findById(message);
  }
}
