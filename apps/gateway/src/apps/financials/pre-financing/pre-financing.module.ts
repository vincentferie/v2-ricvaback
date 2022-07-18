import { Module } from '@nestjs/common';
import { PreFinancingController } from './pre-financing.controller';

@Module({
  controllers: [PreFinancingController],
  providers: [],
})
export class PreFinancingModule {}
