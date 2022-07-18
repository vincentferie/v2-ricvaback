import { Module } from '@nestjs/common';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { CampagneTrancheController } from './tranche.controller';
import { CampagneTrancheService } from './tranche.service';

@Module({
  imports: [MainComponentModule],
  controllers: [CampagneTrancheController],
  providers: [CampagneTrancheService, VerifUser],
})
export class CampagneTrancheModule {}
