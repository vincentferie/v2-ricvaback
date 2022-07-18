import { StateLots } from '@app/saas-component/helpers/enums';
import { UUIDVersion } from 'class-validator';

export interface LotModel {
  id: UUIDVersion;
  campagne_id: UUIDVersion;
  site_id: UUIDVersion;
  entrepot_id: UUIDVersion;
  exportateur_id: UUIDVersion;
  speculation_id: UUIDVersion;
  dechargement_id: UUIDVersion;
  specificity_id: UUIDVersion;
  numero_ticket_pese: number;
  numero_lot: number;
  sac_en_stock: number;
  premiere_pesee: number;
  deuxieme_pesee: number;
  reconditionne: number;
  tare_emballage_refraction: number;
  poids_net: number;
  sacs_decharge: number;
  date_dechargement: Date;
  statut: StateLots;
  validity: boolean;
  file: any;
}
