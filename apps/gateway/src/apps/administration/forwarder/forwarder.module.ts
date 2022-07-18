import { Module } from '@nestjs/common';
import { ForwarderController } from './forwarder.controller';

@Module({
  controllers: [ForwarderController],
  providers: [],
})
export class ForwarderModule {}
