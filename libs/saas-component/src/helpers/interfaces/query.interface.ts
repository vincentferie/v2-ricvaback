import { UUIDVersion } from 'class-validator';

export interface QueryParam {
  order: any;
  offset: string | number;
  take: string | number;
  query: string;
  filter_id: UUIDVersion;
  filter_two_id: UUIDVersion;
  filter_three_id: UUIDVersion;
  filter_four_id: UUIDVersion;
  flag: string;
}
