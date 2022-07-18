import { Module } from '@nestjs/common';
import { CampagneOutturnController } from './campagne-outturn.controller';

@Module({
  controllers: [CampagneOutturnController],
  providers: [],
})
export class CampagneOutturnModule {}
