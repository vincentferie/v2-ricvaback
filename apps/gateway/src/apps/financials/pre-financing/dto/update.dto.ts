import { PartialType } from '@nestjs/swagger';
import { CreatePreFinancingDto } from './create.dto';
export class UpdatePreFinancingDto extends PartialType(CreatePreFinancingDto) {}
