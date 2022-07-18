import { UUIDVersion } from 'class-validator';
import { IPVersion } from 'net';

export interface IRmqPayloadHeader {
  clientIp: IPVersion;
  userAgent: string;
  tenantHead: string;
  tenantId: UUIDVersion;
  host: string;
  method: string;
  url: string;
  routePath: string;
  stack: any;
  methods: any;
}
