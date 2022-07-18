import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateDto, UpdateDto } from './dto';
import {
  RmqPayloadBodyPipe,
  RmqPayloadParamsPipe,
  RmqPayloadQueryPipe,
} from '@app/saas-component/helpers/pipes';
import { IRmqInput } from '@app/saas-component/helpers/interfaces';
import { WarehousesService } from './warehouses.service';
import { warehousesPattern } from '@app/saas-component/helpers/constants';

@Controller('warehouses')
export class WarehousesController {
  private readonly logger = new Logger(WarehousesController.name);

  constructor(private readonly service: WarehousesService) {}

  @MessagePattern({ cmd: warehousesPattern[0] })
  async save(
    @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<CreateDto>,
  ): Promise<any> {
    return this.service.save(message);
  }

  @MessagePattern({ cmd: warehousesPattern[1] })
  async update(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.update(message);
  }

  @MessagePattern({ cmd: warehousesPattern[2] })
  async delete(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.delete(message);
  }

  @MessagePattern({ cmd: warehousesPattern[3] })
  async softDelete(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.softDelete(message);
  }

  @MessagePattern({ cmd: warehousesPattern[4] })
  async restore(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.restore(message);
  }

  @MessagePattern({ cmd: warehousesPattern[5] })
  async findAll(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findAll(message);
  }

  @MessagePattern({ cmd: warehousesPattern[6] })
  async findPaginate(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findPaginate(message);
  }

  @MessagePattern({ cmd: warehousesPattern[7] })
  async findPaginateResearch(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findPaginateResearch(message);
  }

  @MessagePattern({ cmd: warehousesPattern[8] })
  async findDeleted(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findDeleted(message);
  }

  @MessagePattern({ cmd: warehousesPattern[9] })
  async findCompletion(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findCompletion(message);
  }

  @MessagePattern({ cmd: warehousesPattern[10] })
  async findById(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findById(message);
  }

  @MessagePattern({ cmd: warehousesPattern[11] })
  async findBySite(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findBySite(message);
  }
}
