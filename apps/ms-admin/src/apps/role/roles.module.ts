import { Module } from '@nestjs/common';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { RulesService } from './roles.service';
import { RulesController } from './role.controller';

@Module({
  imports: [MainComponentModule],
  controllers: [RulesController],
  providers: [RulesService, VerifUser],
})
export class RulesModule {}
