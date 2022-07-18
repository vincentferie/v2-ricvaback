import { Module } from '@nestjs/common';
import { RequiredController } from './required.controller';

@Module({
  controllers: [RequiredController],
  providers: [],
})
export class RequiredModule {}
