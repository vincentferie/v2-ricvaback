import { Module } from '@nestjs/common';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { CampagneController } from './campagne.controller';
import { CampagneService } from './campagne.service';

@Module({
  imports: [MainComponentModule],
  controllers: [CampagneController],
  providers: [CampagneService, VerifUser],
})
export class CampagneModule {}
