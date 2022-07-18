import { Module } from '@nestjs/common';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { SiteAssignmentController } from './site-assignment.controller';
import { SiteAssignmentService } from './site-assignment.service';

@Module({
  imports: [MainComponentModule],
  controllers: [SiteAssignmentController],
  providers: [SiteAssignmentService, VerifUser],
})
export class SiteAssignmentModule {}
