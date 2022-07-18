import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { isDefined } from 'class-validator';
import { IRmqPayloadRecieved } from '../interfaces';

@Injectable()
export class RmqPayloadHeaderPipe implements PipeTransform {
  transform(
    payloadRecieved: IRmqPayloadRecieved<any>,
    metadata: ArgumentMetadata,
  ) {
    if (isDefined(payloadRecieved)) {
      return {
        clientIp: payloadRecieved.headers.clientIp,
        userAgent: payloadRecieved.headers.userAgent,
        tenantHead: payloadRecieved.headers.tenantHead,
        tenantId: payloadRecieved.headers.tenantId,
        host: payloadRecieved.headers.other.host,
        method: payloadRecieved.headers.other.method,
        url: payloadRecieved.headers.other.url,
        routePath: payloadRecieved.headers.route.path,
        stack: payloadRecieved.headers.route.stack,
        methods: payloadRecieved.headers.route.methods,
      };
    }
  }
}
