import { UUIDVersion } from 'class-validator';

export interface PledgeProcessingModel {
  id: UUIDVersion;
  campagne_id: UUIDVersion;
  compte_banque_id: UUIDVersion;
  sous_compte_banque_id: UUIDVersion;
  transitaire_id: UUIDVersion;
  entrepot_id: UUIDVersion;
  numero: string;
  prix_unitaire: number;
  nbr_sacs: number;
  poids: number;
  nbre_lots: number;
  destination: string;
  proprietaire: string;
  navire: string;
  port_embarquement: string;
  ltd: string;
  campagne: number;
  tirage: number;
  montant_credite: number;
  debours: number;

  date: Date;
  lots: UUIDVersion[];
  file_analysis: any;
  file_application: any;
  file_draw: any;
  file_release: any;
}
