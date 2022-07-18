import { Module } from '@nestjs/common';
import { CampagneController } from './campagne.controller';

@Module({
  controllers: [CampagneController],
  providers: [],
})
export class CampagneModule {}
