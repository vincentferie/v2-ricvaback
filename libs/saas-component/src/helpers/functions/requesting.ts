import { ClientProxy } from '@nestjs/microservices';
import { map, tap } from 'rxjs';
import { responseRequest } from '../core/response-request';

export const Sending = async (
  payloadInfo: any,
  client: ClientProxy,
  pattern: string,
) => {
  if (payloadInfo) {
    try {
      return client.send<any, any>({ cmd: pattern }, payloadInfo);
    } catch (error) {
      return responseRequest({
        status: 'errorRequest',
        data: error,
        params: 'Requête impossible à satisfaire.',
      });
    }
  } else {
    return responseRequest({
      status: 'errorRequest',
      data: null,
      params: 'Payload abscente.',
    });
  }
};

export const Emmitter = async (
  payloadInfo: any,
  client: ClientProxy,
  pattern: any,
) => {
  if (payloadInfo) {
    try {
      return client.emit<any, any>({ cmd: pattern }, payloadInfo);
    } catch (error) {
      return responseRequest({
        status: 'errorRequest',
        data: error,
        params: 'Requête impossible à satisfaire.',
      });
    }
  } else {
    return responseRequest({
      status: 'errorRequest',
      data: null,
      params: 'Payload abscente.',
    });
  }
};
