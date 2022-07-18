import { StateChargement } from '@app/saas-component/helpers/enums';
import { UUIDVersion } from 'class-validator';

export interface UnloadingModel {
  id: UUIDVersion;
  superviseur_id: UUIDVersion;
  campagne_id: UUIDVersion;
  provenance_id: UUIDVersion;
  specificity_id: UUIDVersion;
  exportateur_id: UUIDVersion;
  entrepot_id: UUIDVersion;
  speculation_id: UUIDVersion;
  num_fiche: string;
  date_chargement: Date;
  tracteur: string;
  remorque: string;
  fournisseur: string;
  contact_fournisseur: string;
  transporteur: string;
  statut: StateChargement;
  validity: boolean;
  file: any;
}
