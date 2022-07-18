import { PartialType } from '@nestjs/swagger';
import { CreateSiteDto } from './create.dto';
export class UpdateSiteDto extends PartialType(CreateSiteDto) {}
