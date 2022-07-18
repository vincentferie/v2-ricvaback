import { PartialType } from '@nestjs/swagger';
import { CreateCampagneOutturnDto } from './create.dto';
export class UpdateCampagneOutturnDto extends PartialType(
  CreateCampagneOutturnDto,
) {}
