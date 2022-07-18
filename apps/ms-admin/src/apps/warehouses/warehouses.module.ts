import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { Module } from '@nestjs/common';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { WarehousesController } from './warehouses.controller';
import { WarehousesService } from './warehouses.service';

@Module({
  imports: [MainComponentModule],
  controllers: [WarehousesController],
  providers: [WarehousesService, VerifUser],
})
export class WarehousesModule {}
