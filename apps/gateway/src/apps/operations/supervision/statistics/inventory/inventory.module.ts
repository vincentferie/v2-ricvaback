import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';

@Module({
  controllers: [InventoryController],
  providers: [],
})
export class InventoryModule {}
