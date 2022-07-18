import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { Module } from '@nestjs/common';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { LotsController } from './lots.controller';
import { LotsService } from './lots.service';

@Module({
  imports: [MainComponentModule],
  controllers: [LotsController],
  providers: [LotsService, VerifUser],
})
export class LotsModule {}
