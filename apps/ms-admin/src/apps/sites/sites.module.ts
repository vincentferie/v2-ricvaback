import { Module } from '@nestjs/common';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';

@Module({
  imports: [MainComponentModule],
  controllers: [SitesController],
  providers: [SitesService, VerifUser],
})
export class SitesModule {}
