import { PartialType } from '@nestjs/swagger';
import { CreateSpecificityDto } from './create.dto';
export class UpdateSpecificityDto extends PartialType(CreateSpecificityDto) {}
