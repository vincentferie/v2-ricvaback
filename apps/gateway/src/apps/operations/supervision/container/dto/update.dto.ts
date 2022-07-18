import { PartialType } from '@nestjs/swagger';
import { CreateContainerDto } from './create.dto';
export class UpdateContainerDto extends PartialType(CreateContainerDto) {}
