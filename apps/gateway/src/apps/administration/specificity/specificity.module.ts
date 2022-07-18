import { Module } from '@nestjs/common';
import { SpecificityController } from './specificity.controller';

@Module({
  controllers: [SpecificityController],
  providers: [],
})
export class SpecificityModule {}
