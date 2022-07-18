import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { Module } from '@nestjs/common';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { LotsValidationController } from './lot-validation.controller';
import { LotsValidationService } from './lot-validation.service';
@Module({
  imports: [MainComponentModule],
  controllers: [LotsValidationController],
  providers: [LotsValidationService, VerifUser],
})
export class LotsValidationModule {}
