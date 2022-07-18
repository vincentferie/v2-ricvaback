import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { isDefined } from 'class-validator';
import { IRmqPayloadRecieved } from '../interfaces/rabbitmq-payload-recieved.interface';

@Injectable()
export class RmqPayloadQueryPipe implements PipeTransform {
  transform(
    payloadRecieved: IRmqPayloadRecieved<any>,
    metadata: ArgumentMetadata,
  ) {
    if (isDefined(payloadRecieved)) {
      return {
        param: payloadRecieved.payload.param,
        value: payloadRecieved.payload.query,
        file: payloadRecieved.payload?.file,
        user: payloadRecieved.payload.user,
      };
    }
  }
}
