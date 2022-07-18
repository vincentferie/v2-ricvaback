import { StateBooking } from '@app/saas-component/helpers/enums';
import { UUIDVersion } from 'class-validator';

export interface BookingModel {
  id: UUIDVersion;
  numero_reel: string;
  numero_change: string;
  state: StateBooking;
  file: any;
}
