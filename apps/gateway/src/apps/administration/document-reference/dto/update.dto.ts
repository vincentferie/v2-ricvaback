import { PartialType } from '@nestjs/swagger';
import { CreateDocumentRefDto } from './create.dto';
export class UpdateDocumentRefDto extends PartialType(CreateDocumentRefDto) {}
