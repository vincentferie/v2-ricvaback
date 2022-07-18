import { UUIDVersion } from 'class-validator';

export interface TransfertModel {
  id: UUIDVersion;
  lot_id: UUIDVersion;
  site_provenance_id: UUIDVersion;
  site_destination_id: UUIDVersion;
  statut_tirage: string;
  poids_net_mq: number;
  sac_mq: number;
  poids_net_dechet: number;
  sac_dechet: number;
  poids_net_poussiere: number;
  total_sac_trie: number;
  sac_poussiere: number;
}
