import { PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create.dto';
export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
