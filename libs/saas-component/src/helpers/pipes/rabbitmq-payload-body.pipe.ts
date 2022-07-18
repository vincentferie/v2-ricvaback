import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { isDefined } from 'class-validator';
import { IRmqPayloadRecieved } from '../interfaces';

@Injectable()
export class RmqPayloadBodyPipe implements PipeTransform {
  transform(
    payloadRecieved: IRmqPayloadRecieved<any>,
    metadata: ArgumentMetadata,
  ) {
    if (isDefined(payloadRecieved)) {
      return {
        value: payloadRecieved.payload.body,
        param: payloadRecieved.payload?.param,
        file: payloadRecieved.payload?.file,
        user: payloadRecieved.payload.user,
      };
    }
  }
}
