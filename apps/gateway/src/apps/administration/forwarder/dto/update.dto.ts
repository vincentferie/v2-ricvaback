import { PartialType } from '@nestjs/swagger';
import { CreateForwarderDto } from './create.dto';
export class UpdateForwarderDto extends PartialType(CreateForwarderDto) {}
