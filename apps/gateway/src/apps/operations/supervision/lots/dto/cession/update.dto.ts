import { PartialType } from '@nestjs/swagger';
import { CreateCessionDto } from './create.dto';
export class UpdateCessionDto extends PartialType(CreateCessionDto) {}
