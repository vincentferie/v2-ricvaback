import { UUIDVersion } from 'class-validator';
import { Double } from 'typeorm';

export interface CampagneOutturnModel {
  id: UUIDVersion;
  campagne_id: UUIDVersion;
  min_outturn: Double;
  max_outturn: Double;
  flag: string;
}
