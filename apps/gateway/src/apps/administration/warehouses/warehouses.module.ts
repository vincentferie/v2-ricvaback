import { Module } from '@nestjs/common';
import { WarehousesController } from './warehouses.controller';

@Module({
  controllers: [WarehousesController],
  providers: [],
})
export class WarehousesModule {}
