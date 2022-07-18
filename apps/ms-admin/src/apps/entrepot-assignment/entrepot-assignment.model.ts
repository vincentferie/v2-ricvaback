import { UUIDVersion } from 'class-validator';

export interface EntrepotAssignmentModel {
  id: UUIDVersion;
  superviseur_id: UUIDVersion;
  entrepot_id: UUIDVersion;
  actif: boolean;
}
