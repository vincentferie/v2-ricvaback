import { Module } from '@nestjs/common';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { ContainerController } from './container.controller';
import { ContainerService } from './container.service';

@Module({
  imports: [],
  controllers: [ContainerController],
  providers: [ContainerService, VerifUser],
})
export class ContainerModule {}
