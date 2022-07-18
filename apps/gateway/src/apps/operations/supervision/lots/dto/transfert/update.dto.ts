import { PartialType } from '@nestjs/swagger';
import { CreateTransfertDto } from './create.dto';
export class UpdateTransfertDto extends PartialType(CreateTransfertDto) {}
