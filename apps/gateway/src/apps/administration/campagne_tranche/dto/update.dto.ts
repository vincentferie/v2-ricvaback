import { PartialType } from '@nestjs/swagger';
import { CreateCampagneTrancheDto } from './create.dto';
export class UpdateCampagneTrancheDto extends PartialType(
  CreateCampagneTrancheDto,
) {}
