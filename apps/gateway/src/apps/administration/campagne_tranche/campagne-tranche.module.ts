import { Module } from '@nestjs/common';
import { CampagneTrancheController } from './campagne-tranche.controller';

@Module({
  controllers: [CampagneTrancheController],
  providers: [],
})
export class CampagneTrancheModule {}
