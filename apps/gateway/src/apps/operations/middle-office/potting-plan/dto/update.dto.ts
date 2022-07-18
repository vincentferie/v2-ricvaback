import { PartialType } from '@nestjs/swagger';
import { CreatePlanDto } from './create.dto';
export class UpdatePlanDto extends PartialType(CreatePlanDto) {}
