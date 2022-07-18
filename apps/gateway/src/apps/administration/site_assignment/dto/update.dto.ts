import { PartialType } from '@nestjs/swagger';
import { CreateSiteAssignmentDto } from './create.dto';
export class UpdateSiteAssignmentDto extends PartialType(
  CreateSiteAssignmentDto,
) {}
