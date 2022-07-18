import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { Module } from '@nestjs/common';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { UnloadingController } from './unloading.controller';
import { UploadingService } from './unloading.service';

@Module({
  imports: [MainComponentModule],
  controllers: [UnloadingController],
  providers: [UploadingService, VerifUser],
})
export class UnloadingModule {}
