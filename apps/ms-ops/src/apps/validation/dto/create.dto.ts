import { IsOptional, IsUUID, UUIDVersion } from 'class-validator';
export class CreateDto {
  @IsOptional()
  @IsUUID()
  dechargement_id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  lot_id: UUIDVersion;
}
