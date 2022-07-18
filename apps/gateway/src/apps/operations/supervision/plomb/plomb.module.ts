import { Module } from '@nestjs/common';
import { PlombsController } from './plomb.controller';

@Module({
  controllers: [PlombsController],
  providers: [],
})
export class PlombsModule {}
