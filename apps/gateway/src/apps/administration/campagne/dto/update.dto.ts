import { PartialType } from '@nestjs/swagger';
import { CreateCampagneDto } from './create.dto';
export class UpdateCampagneDto extends PartialType(CreateCampagneDto) {}
