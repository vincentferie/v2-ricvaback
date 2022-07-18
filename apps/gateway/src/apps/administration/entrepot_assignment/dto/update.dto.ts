import { PartialType } from '@nestjs/swagger';
import { CreateEntrepotAssignmentDto } from './create.dto';
export class UpdateEntrepotAssignmentDto extends PartialType(
  CreateEntrepotAssignmentDto,
) {}
