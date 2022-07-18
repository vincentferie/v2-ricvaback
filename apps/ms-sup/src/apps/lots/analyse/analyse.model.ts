import { UUIDVersion } from 'class-validator';
import { Double } from 'typeorm';

export interface AnalysesModel {
  id: UUIDVersion;
  lot_id: UUIDVersion;
  out_turn: Double;
  grainage: number;
  th: Double;
}
