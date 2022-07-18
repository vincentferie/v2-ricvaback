import { PartialType } from '@nestjs/swagger';
import { CreateBankAccompteDto } from './create.dto';
export class UpdateBankAccompteDto extends PartialType(CreateBankAccompteDto) {}
