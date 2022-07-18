import { PartialType } from '@nestjs/swagger';
import { CreateLotValidDto } from './create.dto';
export class UpdateLotValidDto extends PartialType(CreateLotValidDto) {}
