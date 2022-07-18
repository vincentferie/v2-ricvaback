import { Module } from '@nestjs/common';
import { EntrepotAssignmentController } from './entrepot-assignment.controller';

@Module({
  controllers: [EntrepotAssignmentController],
  providers: [],
})
export class EntrepotAssignmentModule {}
