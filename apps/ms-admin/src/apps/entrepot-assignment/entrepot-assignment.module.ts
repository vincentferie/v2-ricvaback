import { Module } from '@nestjs/common';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { EntrepotAssignmentController } from './entrepot-assignment.controller';
import { EntrepotAssignmentService } from './entrepot-assignment.service';

@Module({
  imports: [MainComponentModule],
  controllers: [EntrepotAssignmentController],
  providers: [EntrepotAssignmentService, VerifUser],
})
export class EntrepotAssignmentModule {}
