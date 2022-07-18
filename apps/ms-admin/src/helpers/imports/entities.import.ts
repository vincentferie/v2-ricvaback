import { AccountEntity } from '../../apps/account/account.entity';
import { CampagneOutturnEntity } from '../../apps/campagne-outturn/outturn.entity';
import { CampagneTrancheEntity } from '../../apps/campagne-tranche/tranche.entity';
import { ExporterEntity } from '../../apps/exporter/exporter.entity';
import { ForwarderEntity } from '../../apps/forwarder/forwarder.entity';
import { RoleEntity } from '../../apps/role/role.entity';
import { SiteEntity } from '../../apps/sites/site.entity';
import { SpecificityEntity } from '../../apps/specificity/specificity.entity';
import { EntrepotAssignmentEntity } from '../../apps/entrepot-assignment/entrepot-assignment.entity';
import { WarehousesEntity } from '../../apps/warehouses/warehouses.entity';
import { SiteAssignmentEntity } from '../../apps/site-assignment/site-assignment.entity';
import { TenantCampagneEntity } from '../../apps/campagne/campagne.entity';

export const Entities = [
  AccountEntity,
  RoleEntity,
  WarehousesEntity,
  ExporterEntity,
  SiteEntity,
  SpecificityEntity,
  EntrepotAssignmentEntity,
  SiteAssignmentEntity,
  ForwarderEntity,
  TenantCampagneEntity,
  CampagneOutturnEntity,
  CampagneTrancheEntity,
];
