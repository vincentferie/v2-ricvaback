import { ContainerType } from '@app/saas-component/helpers/enums';
import { UUIDVersion } from 'class-validator';

export interface ContainerModel {
  id: UUIDVersion;
  booking_id: UUIDVersion;
  entrepot_id: UUIDVersion;
  numero: string;
  type_tc: ContainerType;
  capacite: number;
}
