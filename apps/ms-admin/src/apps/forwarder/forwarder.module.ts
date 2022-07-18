import { Module } from '@nestjs/common';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { ForwarderService } from './forwarder.service';
import { ForwarderController } from './forwarder.controller';

@Module({
  controllers: [ForwarderController],
  providers: [ForwarderService, VerifUser],
})
export class ForwarderModule {}
