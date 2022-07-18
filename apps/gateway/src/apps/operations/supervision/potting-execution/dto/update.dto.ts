import { PartialType } from '@nestjs/swagger';
import { CreateExecutionDto } from './create.dto';
export class UpdateExecutionDto extends PartialType(CreateExecutionDto) {}
