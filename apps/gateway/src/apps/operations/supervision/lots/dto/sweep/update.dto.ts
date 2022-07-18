import { PartialType } from '@nestjs/swagger';
import { CreateSweepDto } from './create.dto';
export class UpdateSweepDto extends PartialType(CreateSweepDto) {}
