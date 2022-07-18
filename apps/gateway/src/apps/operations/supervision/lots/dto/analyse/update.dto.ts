import { PartialType } from '@nestjs/swagger';
import { CreateLotsAnalysDto } from './create.dto';
export class UpdateLotsAnalysDto extends PartialType(CreateLotsAnalysDto) {}
