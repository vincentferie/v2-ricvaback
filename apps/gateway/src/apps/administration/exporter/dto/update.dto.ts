import { PartialType } from '@nestjs/swagger';
import { CreateExporterDto } from './create.dto';
export class UpdateExporterDto extends PartialType(CreateExporterDto) {}
