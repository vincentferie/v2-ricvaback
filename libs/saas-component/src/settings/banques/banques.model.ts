import { UUIDVersion } from 'class-validator';
import { BanquesSpecModel } from './banques-spec/banques-spec.model';

export interface BanquesModel {
  id: UUIDVersion;
  libelle: string;
  details: BanquesSpecModel[];
}
