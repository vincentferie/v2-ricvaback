import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateDto, UpdateDto } from './dto';
import {
  RmqPayloadBodyPipe,
  RmqPayloadParamsPipe,
  RmqPayloadQueryPipe,
} from '@app/saas-component/helpers/pipes';
import { IRmqInput } from '@app/saas-component/helpers/interfaces';
import { containerPattern } from '@app/saas-component/helpers/constants';
import { ContainerService } from './container.service';
import { PlombDto } from './dto/plomb.dto';

@Controller('container')
export class ContainerController {
  private readonly logger = new Logger(ContainerController.name);

  constructor(private readonly service: ContainerService) {}

  @MessagePattern({ cmd: containerPattern[0] })
  async save(
    @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<CreateDto>,
  ): Promise<any> {
    return this.service.save(message);
  }

  @MessagePattern({ cmd: containerPattern[1] })
  async update(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.update(message);
  }

  @MessagePattern({ cmd: containerPattern[2] })
  async delete(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.delete(message);
  }

  @MessagePattern({ cmd: containerPattern[3] })
  async softDelete(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<UpdateDto>,
  ): Promise<any> {
    return this.service.softDelete(message);
  }

  @MessagePattern({ cmd: containerPattern[4] })
  async restore(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.restore(message);
  }

  @MessagePattern({ cmd: containerPattern[5] })
  async findAll(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findAll(message);
  }

  @MessagePattern({ cmd: containerPattern[6] })
  async findPaginate(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findPaginate(message);
  }

  @MessagePattern({ cmd: containerPattern[7] })
  async findPaginateResearch(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findPaginateResearch(message);
  }

  @MessagePattern({ cmd: containerPattern[8] })
  async findDeleted(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findDeleted(message);
  }

  @MessagePattern({ cmd: containerPattern[9] })
  async findCompletion(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findCompletion(message);
  }

  @MessagePattern({ cmd: containerPattern[10] })
  async findById(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findById(message);
  }

  @MessagePattern({ cmd: containerPattern[11] })
  async findByBooking(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findByBooking(message);
  }

  @MessagePattern({ cmd: containerPattern[12] })
  async findByBookingNoStuffing(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findByBookingNoStuffing(message);
  }

  @MessagePattern({ cmd: containerPattern[13] })
  async findByNoPlomb(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findByNoPlomb(message);
  }

  @MessagePattern({ cmd: containerPattern[14] })
  async findByPlomb(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findByPlomb(message);
  }

  @MessagePattern({ cmd: containerPattern[15] })
  async savePlomb(
    @Payload(new RmqPayloadBodyPipe()) message: IRmqInput<PlombDto>,
  ): Promise<any> {
    return this.service.savePlomb(message);
  }

  @MessagePattern({ cmd: containerPattern[16] })
  async updatePlomb(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<PlombDto>,
  ): Promise<any> {
    return this.service.updatePlomb(message);
  }

  @MessagePattern({ cmd: containerPattern[17] })
  async deletePlomb(
    @Payload(new RmqPayloadParamsPipe()) message: IRmqInput<PlombDto>,
  ): Promise<any> {
    return this.service.deletePlomb(message);
  }

  @MessagePattern({ cmd: containerPattern[18] })
  async findByNoExecuted(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findByNoExecuted(message);
  }

  @MessagePattern({ cmd: containerPattern[19] })
  async findByNoBL(
    @Payload(new RmqPayloadQueryPipe()) message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.findByNoBL(message);
  }

}
