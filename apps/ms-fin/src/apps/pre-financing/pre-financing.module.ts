import { Module } from '@nestjs/common';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { PreFinancingService } from './pre-financing.service';
import { PreFinancingController } from './pre-financing.controller';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { MovementAccount } from '../../helpers/services/movement/movement.service';

@Module({
  imports: [MainComponentModule],
  controllers: [PreFinancingController],
  providers: [PreFinancingService, VerifUser, MovementAccount],
})
export class PreFinancingModule {}
