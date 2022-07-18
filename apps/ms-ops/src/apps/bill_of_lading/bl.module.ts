import { Module } from '@nestjs/common';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { BillOfLadingController } from './bl.controller';
import { BillOfLadingService } from './bl.service';

@Module({
  imports: [],
  controllers: [BillOfLadingController],
  providers: [BillOfLadingService, VerifUser],
})
export class BillOfLadingModule {}
