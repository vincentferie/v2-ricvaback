import { Module } from '@nestjs/common';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { SpecificityController } from './specificity.controller';
import { SpecificityService } from './specificity.service';

@Module({
  imports: [MainComponentModule],
  controllers: [SpecificityController],
  providers: [SpecificityService, VerifUser],
})
export class SpecificityModule {}
