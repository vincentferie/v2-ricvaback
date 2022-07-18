import { PartialType } from '@nestjs/swagger';
import { CreateBillDto } from './create.dto';
export class UpdateBillDto extends PartialType(CreateBillDto) {}
