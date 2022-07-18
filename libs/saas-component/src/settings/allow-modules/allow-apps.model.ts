import { UUIDVersion } from 'class-validator';

export interface AllowAppsModel {
  id: UUIDVersion;
  tenant_app_id: UUIDVersion;
  module_id: UUIDVersion;
  menu_id: UUIDVersion;
  smenu_id: UUIDVersion;
}
