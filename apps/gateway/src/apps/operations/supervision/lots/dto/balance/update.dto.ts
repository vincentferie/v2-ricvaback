import { PartialType } from '@nestjs/swagger';
import { CreateLotsBalanceDto } from './create.dto';
export class UpdateLotsBalanceDto extends PartialType(CreateLotsBalanceDto) {}
