import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateDto, UpdateDto } from './dto';
import { ExporterService } from './exporter.service';
import {
  RmqPayloadBodyPipe,
  RmqPayloadParamsPipe,
  RmqPayloadQueryPipe,
} from '@app/saas-component/helpers/pipes';
import { IRmqInput } from '@app/saas-component/helpers/interfaces';
import { exporterPattern } from '@app/saas-component';

@Controller('exporter')
export class ExporterController {
  private readonly logger = new Logger(ExporterController.name);

  constructor(private readonly service: ExporterService) {}

  @MessagePattern({ cmd: exporterPattern[0] })
  async save(
    @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<CreateDto>,
  ): Promise<any> {
    return this.service.save(message);
  }

  @MessagePattern({ cmd: exporterPattern[1] })
  async update(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.update(message);
  }

  @MessagePattern({ cmd: exporterPattern[2] })
  async delete(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.delete(message);
  }

  @MessagePattern({ cmd: exporterPattern[3] })
  async softDelete(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.softDelete(message);
  }

  @MessagePattern({ cmd: exporterPattern[4] })
  async restore(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.restore(message);
  }

  @MessagePattern({ cmd: exporterPattern[5] })
  async findAll(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findAll(message);
  }

  @MessagePattern({ cmd: exporterPattern[6] })
  async findPaginate(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findPaginate(message);
  }

  @MessagePattern({ cmd: exporterPattern[7] })
  async findPaginateResearch(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findPaginateResearch(message);
  }

  @MessagePattern({ cmd: exporterPattern[8] })
  async findDeleted(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findDeleted(message);
  }

  @MessagePattern({ cmd: exporterPattern[9] })
  async findCompletion(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findCompletion(message);
  }

  @MessagePattern({ cmd: exporterPattern[10] })
  async findById(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findById(message);
  }
}
