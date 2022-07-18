import { Global, Module } from '@nestjs/common';
import {
  TenantProvider,
  TENANT_CONNECTION,
} from '../helpers/providers/tenant.provider';

@Global()
@Module({
  providers: [TenantProvider],
  exports: [TENANT_CONNECTION],
})
export class TenancyModule {}
