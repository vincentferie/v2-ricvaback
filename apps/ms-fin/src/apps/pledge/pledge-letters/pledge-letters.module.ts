import { Module } from '@nestjs/common';
import { VerifUser } from '../../../helpers/services/verif-user.service';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { PledgeProcessingController } from './pledge-letters.controller';
import { PledgeProcessingService } from './pre-financing.service';

@Module({
  imports: [MainComponentModule],
  controllers: [PledgeProcessingController],
  providers: [PledgeProcessingService, VerifUser],
})
export class PledgeProcessingModule {}
