import { Module } from '@nestjs/common';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { MovementAccount } from '../../helpers/services/movement/movement.service';

@Module({
  imports: [MainComponentModule],
  controllers: [BankAccountController],
  providers: [BankAccountService, VerifUser, MovementAccount],
})
export class BankAccountModule {}
