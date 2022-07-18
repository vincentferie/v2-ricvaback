import { PartialType } from '@nestjs/swagger';
import { CreatePlombDto } from './create.dto';
export class UpdatePlombDto extends PartialType(CreatePlombDto) {}
