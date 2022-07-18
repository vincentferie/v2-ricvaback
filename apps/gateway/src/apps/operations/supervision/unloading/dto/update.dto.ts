import { PartialType } from '@nestjs/swagger';
import { CreateUnloadingDto } from './create.dto';
export class UpdateUnloadingDto extends PartialType(CreateUnloadingDto) {}
