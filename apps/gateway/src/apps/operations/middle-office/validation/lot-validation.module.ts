import { Module } from '@nestjs/common';
import { LotsValidationController } from './lot-validation.controller';

@Module({
  controllers: [LotsValidationController],
  providers: [],
})
export class LotsValidationModule {}
