import { UUIDVersion } from 'class-validator';

export interface DatabasingModel {
  id: UUIDVersion;
  tenant_id: UUIDVersion;
  tenant_app_id: UUIDVersion;
  type: string;
  host: string;
  port: number;
  basename: string;
  username: string;
  password: string;
  active: boolean;
}
