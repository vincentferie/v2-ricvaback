import { Module } from '@nestjs/common';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { VerifUser } from '../../helpers/services/verif-user.service';

@Module({
  imports: [MainComponentModule],
  controllers: [AccountsController],
  providers: [AccountsService, VerifUser],
})
export class AccountsModule {}
