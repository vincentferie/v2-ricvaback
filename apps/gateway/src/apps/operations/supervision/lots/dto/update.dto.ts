import { PartialType } from '@nestjs/swagger';
import { CreateLotDto } from './create.dto';
export class UpdateLotDto extends PartialType(CreateLotDto) {}
