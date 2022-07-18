import { Module } from '@nestjs/common';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { DocumentRefService } from './document-reference.service';
import { DocumentRefController } from './document-reference.controller';

@Module({
  imports: [MainComponentModule],
  controllers: [DocumentRefController],
  providers: [DocumentRefService, VerifUser],
})
export class DocumentRefModule {}
