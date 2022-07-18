import { Module } from '@nestjs/common';
import { SiteAssignmentController } from './site-assignment.controller';

@Module({
  controllers: [SiteAssignmentController],
  providers: [],
})
export class SiteAssignmentModule {}
