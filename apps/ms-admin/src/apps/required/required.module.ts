import { Module } from '@nestjs/common';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { RequiredController } from './required.controller';
import { RequiredService } from './required.service';

@Module({
  imports: [MainComponentModule],
  controllers: [RequiredController],
  providers: [RequiredService, VerifUser],
})
export class RequiredModule {}
