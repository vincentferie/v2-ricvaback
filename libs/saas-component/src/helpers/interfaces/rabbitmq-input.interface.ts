import { UUIDVersion } from 'class-validator';

export interface IRmqInput<Dto> {
  value: Dto;
  param: UUIDVersion;
  file: any | null;
  user: any;
}
