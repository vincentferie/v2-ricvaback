import { UUIDVersion } from 'class-validator';
import { IPVersion } from 'net';

export interface IRmqPayloadRecieved<B> {
  payload: {
    body: B;
    file: any;
    query: any;
    param: string;
    user: any;
  };
  headers: {
    userAgent: string;
    tenantHead: string;
    tenantId: UUIDVersion;
    clientIp: IPVersion;
    route: {
      path: string;
      stack: any;
      methods: any;
    };
    other: {
      host: string;
      url: string;
      method: string;
    };
  };
}
