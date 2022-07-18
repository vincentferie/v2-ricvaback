import { IsOptional, IsUUID, UUIDVersion } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateLotValidDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  dechargement_id: UUIDVersion;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  lot_id: UUIDVersion;
}
