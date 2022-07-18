import { UUIDVersion } from 'class-validator';
import { Double } from 'typeorm';

export interface BanquesSpecModel {
  id: UUIDVersion;
  banque_id: UUIDVersion;
  ligne: string;
  montant: number;
  currency: string;
  duree: number;
  echeance: Date;
  taux: Double;
  hauteur_tirage: number;
  duree_tirage: number;
  compte_sequestre: number;
  frais_tirage: number;
  flat: number;
  libelle_garantie: string;
  depot_garantie: number;
  limite_garantie: number;
  frais_dossier: Double;
  frais_struct: Double;
  cmm_mvt: Double;
  comm_ft_dcrt: Double;
}
