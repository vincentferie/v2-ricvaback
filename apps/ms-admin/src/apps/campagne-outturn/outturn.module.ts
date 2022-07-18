
import { Module } from '@nestjs/common';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { CampagneOutturnController } from './outturn.controller';
import { CampagneOutturnService } from './outturn.service';

@Module({
  imports: [MainComponentModule],
  controllers: [CampagneOutturnController],
  providers: [CampagneOutturnService, VerifUser],
})
export class CampagneOutturnModule {}
