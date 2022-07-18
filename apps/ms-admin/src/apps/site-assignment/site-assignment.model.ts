import { UUIDVersion } from 'class-validator';

export interface SiteAssignmentModel {
  id: UUIDVersion;
  superviseur_id: UUIDVersion;
  site_id: UUIDVersion;
  actif: boolean;
}
